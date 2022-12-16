# SI650-project--Anime Search Engine

## ❓ How to use

- To run search engine(with ReactJS installed)
  - `cd interface`
  - 'cd backend'
    - `flask run` to start the back-end
  - `cd front-end`
    - `npm install` to install all dependencies
    - `npm start` to run the app 🚀

  - You could see a demo [Here](https://drive.google.com/file/d/1dPeGEyibLY2dUrV5dkMzup8CoegBTVmk/view?usp=drivesdk) 

- You could also run the file by using the file `interface/backend/search_model.py`:
  ```python
  model=init_search()
  search_query(model,'new game') # input any query to search without punctuations(the ReactJS way could handle punctuations)
  ```


