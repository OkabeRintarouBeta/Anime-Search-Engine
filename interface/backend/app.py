
from flask import Flask,request
from flask_cors import CORS
from search_model import search_query,init_search
import json

app = Flask(__name__)
CORS(app, resources={"/*": {"origin": "http://localhost:3000"}})

model=init_search()

@app.route('/')
def hello():
    return '<h1>Hello, World!</h1>'

@app.route("/search/",methods=["POST"])
def search():
    global model
    print("---------")
    setPayload = json.loads(request.data.decode('utf-8'))
    query = setPayload["query"]
    # query=str(query)
    # print(str(query))
    print("---------")
    # resp=model(query)
    # print(resp)
    resp=search_query(model,query)
    return resp