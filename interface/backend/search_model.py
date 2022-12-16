import pandas as pd
# Helpful for showing indexing information
pd.set_option('display.max_colwidth', 150)

import os
import pyterrier as pt
# import onir_pt
from sklearn.ensemble import RandomForestRegressor
import math
import warnings
warnings.filterwarnings("ignore")

def load_train_data():
    query=pd.read_csv('../../data_processed/query_list.csv')
    query.reset_index(inplace=True)
    query.rename(columns={'Query':'query','index':'qid'},inplace=True)
    query['query']=query['query'].apply(lambda x:x.replace(','," "))
    train_query=query[query['Train/Test']=='Train'].drop(columns=['Train/Test'])
    test_query=query[query['Train/Test']=='Test'].drop(columns=['Train/Test'])
    df_query=train_query.append(test_query)
    df_query=df_query.reset_index().drop(columns=['index'])
    df_query['query']=df_query['query'].apply(lambda x:x.replace(','," "))

    df_query_train=df_query[df_query['qid'].isin([0,1,2,3,4,5,6,7,8,9,20,21,22,23,24,25,26,27,28,29,30])]
    df_query_train['qid']=df_query_train['qid'].astype('str')
    df_label_train=pd.read_csv("../../labels.csv")
    df_label_train['qid']=df_label_train['qid'].astype('str')
    df_label_train['docno']=df_label_train['docno'].astype('str')
    df_label_train['label']=df_label_train['label'].astype('int64')
    return train_query,df_label_train


def init_search():
    if not pt.started():
        pt.init()

    # initialize index
    pt_index_path = '../../pt_index_with_stemming'
    index_ref = pt.IndexRef.of(pt_index_path+"/data.properties")
    index = pt.IndexFactory.of(index_ref)

    # add re-rankers
    # vbert = onir_pt.reranker.from_checkpoint('https://macavaney.us/scibert-medmarco.tar.gz', 
                                        #  text_field='wiki_intro', expected_md5="854966d0b61543ffffa44cea627ab63b")

    SEED=42
    bm25 = pt.BatchRetrieve(index, wmodel="BM25")
    # learning-to-rank feature
    RANK_CUTOFF = 50
    SEED=42

    from sklearn.model_selection import train_test_split
    sdm = pt.rewrite.SDM()
    qe = pt.rewrite.Bo1QueryExpansion(index)
    pipeline_sdm=sdm>>bm25
    pipeline_qe=bm25>>qe>>bm25

# train_topics, val_topics = train_test_split(train_query, test_size=0.2, random_state=SEED)

    ltr_feats1 = (bm25 % RANK_CUTOFF) >> pt.text.get_text(index, ['docno', 'title', 'synopsis','score', 'wiki_intro', 'review','popularity',])>>  (
    pt.transformer.IdentityTransformer()
    **
    sdm
    **
    pipeline_qe
    ** # score of title (not originally indexed)
    
    (pt.text.scorer(body_attr="title", wmodel='TF_IDF')*3
    +pt.text.scorer(body_attr="synopsis",wmodel='BM25')*2+pt.text.scorer(body_attr="wiki_intro",wmodel='BM25')*2
    +pt.text.scorer(body_attr="review",wmodel='BM25'))
    **
    (pt.apply.doc_score(lambda row: int(math.log((int)(row["popularity"])))))
    **
    (pt.apply.doc_score(lambda row: 0 if row["wiki_intro"]=="none" else 1))
    ** # abstract coordinate match
    pt.BatchRetrieve(index, wmodel="CoordinateMatch")
)


    train_query,df_label_train=load_train_data()

    # train ranker
    rf5 = RandomForestRegressor(n_estimators=400, verbose=1, random_state=SEED, n_jobs=2)
    rf_pipe5 = ltr_feats1 >> pt.ltr.apply_learned_model(rf5)
    rf_pipe5.fit(train_query, df_label_train)

    return rf_pipe5

def search_query(model,query):
    res=model(query)
    ans=[]
    # print(res.columns)
    doc_ids=res['docno'].tolist()[:50]
    doc_ids=[(int)(x) for x in doc_ids]
    df_animes=pd.read_csv('../../data_processed/anime_with_review.csv')
    df_animes=df_animes[['uid','title','synopsis','genre','score','img_url']]
    # print(df_animes[df_animes['uid'].isin(doc_ids)])
    # dic_animes=df_animes.filter(items=doc_ids,axis=0).to_dict('index')
    # print(doc_ids)
    # print(dic_animes)
    dic_animes=df_animes[df_animes['uid'].isin(doc_ids)].to_dict('index')
    # print(dic_animes)
    for id in doc_ids:
        # print(id)
        for k in dic_animes:
            # print(k)
            if dic_animes[k]['uid']==(int)(id):
                # print(dic_animes[k])
                ans.append(dic_animes[k])
                break
    # res=[dic_animes[idx] for idx in doc_ids]
    # print("------------result")
    print(ans)
    
    return ans
model=init_search()
search_query(model,'new game')