const users =  [
  {
    "id": 1,
    "name": "John Price",
    "username": "Captain Price",
    "email": "johnprice@gmail.com"
  },
  {
    "id": 2,
    "name": "John MacTavish",
    "username": "Soap",
    "email": "soap@gmail.com"
  },
  {
    "id": 3,
    "name": "Simon Riley",
    "username": "Ghost",
    "email": "ghost@gmail.com"
  },
  {
    "id": 4,
    "name": "Garry Sanderson",
    "username":"Roach",
    "email": "roach@gmail.com"
  },
]

let posts =  [
  {
    "id": 1,
    "title": "Modern Warfare III",
    "body": "The healthy human mind doesn’t wake up in the morning thinking this is its last day on Earth. But I think that’s a luxury, not a curse. To know you’re close to the end is a kind of freedom. Good time to take inventory. Out-gunned. Outnumbered. Out of our minds. On a suicide mission. But the sand and the rocks here, stained with thousands of years of warfare. They will remember us. For this. Because out of all our vast array of nightmares, this is the one we choose for ourselves. We go forward like a breath exhaled from the Earth. With vigor in our hearts and one goal in sight: We. Will. Kill him",
    "userId": 1,
    "date": "2022-05-02T20:41:05.437Z"
  },
  {
    "id": 2,
    "title": "Modern Warfare II",
    "body": "Too right, mate. Now in the eyes of the world, they're the victims. Nobody's gonna say a word when the Russians club every American they can reach.",
    "userId": 2,
    "date": "2023-09-03T23:52:23.4372"
  }
]

exports.create = (req, res) => {
    const post = {
      id: posts.length + 1,
      title: req.body.title,
      body: req.body.body,
      userId : req.body.userId,
      date: req.body.date,
      reactions: req.body.reactions
    };
    posts.push(post);
    res.send();
  };
  
  exports.findAll = (req, res) => {
        res.send(posts);
  };
  
  exports.update = (req, res) => {
    const id = req.params.id;
    const allPosts = posts.map(post => post);
    const index = allPosts.findIndex(post => post.id === parseInt(id));
    allPosts[index].title = req.body.title;
    allPosts[index].body = req.body.body;
    allPosts[index].userId = req.body.userId;
    allPosts[index].date = req.body.date;    
    posts = allPosts.map(post => post);
    res.send();
  };
  
  exports.delete = (req, res) => {
    const id = req.params.id;
    const index = posts.findIndex(post => post.id === id);
    posts.splice(index, 1);
    res.send();
  };

  exports.reactions = (req, res) => {
    const id = req.params.id;
    const allPosts = posts.map(post => post);
    const index = allPosts.findIndex(post => post.id === parseInt(id));
    allPosts[index].reactions = req.body.reactions;
    posts = allPosts.map(post => post);
    res.send();
  };

  exports.users = (req, res) => {    
    res.send(users);
  }
  
  exports.postsFindByUserId = (req, res) => {
    const id = req.query.userId;
    console.log(req.params);
    res.send(posts.filter(post => post.userId === parseInt(id)));
  }