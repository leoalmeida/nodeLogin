var db = require('../config/mongo_database');

var publicFields = '_id tags type';

exports.listByTag = function(req, res) {
  
  if (!req.user) {
		return res.send(401);
	}
	
	var tagName = req.params.tagName || '';
	if (tagName == '') {
		return res.send(400);
		console.log('Tag name nulo');
	}

	var query = db.pubModel.find({tags: tagName, is_published: true});
	query.select(publicFields);
	query.sort('-created');
	query.exec(function(err, results) {
		if (err) {
  			console.log(err);
  			return res.send(400);
  		}

  		for (var postKey in results) {
    		results[postKey].content = results[postKey].content.substr(0, 400);
    	}

  		return res.json(200, results);
	});
}

exports.listPublished = function(req, res) {  

  if (!req.user) {
		return res.send(401);
	}
  
	var query = db.pubModel.find({is_published: true});

	query.sort('-created');
	query.exec(function(err, results) {
		if (err) {
  			console.log('Erro ao listar os publicados:');
		    console.log(err);
  			return res.send(400);  			
  		}

  		for (var postKey in results) {
    		results[postKey].content = results[postKey].content.substr(0, 400);
    	}

  		return res.json(200, results);
	});
};

exports.listAll = function(req, res) {
	
	var query = db.pubModel.find();
	
	//query.select(publicFields);
	query.sort('-created');
	query.exec(function(err, results) {
		if (err) {
		    console.log('Erro ao listar todos:');
  			console.log(err);
  			return res.send(400);
  		}

  		for (var postKey in results) {
    		results[postKey].content = results[postKey].content.substr(0, 400);
    	}

  		return res.json(200, results);
	});
};

exports.read = function(req, res) {
  
  if (!req.user) {
		return res.send(401);
	}
  
	var id = req.params.id || '';
	if (id == '') {
		return res.send(400);
	}

	var query = db.pubModel.findOne({_id: id});
	query.exec(function(err, result) {
		if (err) {
		    console.log('Erro ao ler:');
  			console.log(err);
  			return res.send(400);
  		}

  		if (result != null) {
  			result.update({ $inc: { read: 1 } }, function(err, nbRows, raw) {
				return res.json(200, result);
			});
  		} else {
  			return res.send(400);
  		}
	});
};

exports.create = function(req, res) {
	if (!req.user) {
		return res.send(401);
	}

	var post = req.body.post;
	if (post == null || post.title == null || post.content == null 
		|| post.tags == null) {
	  console.log('Não foi enviado registro');
	  console.log(post);
		return res.send(400);
	}

	var postEntry = new db.pubModel();
	postEntry.type = post.type;
	postEntry.subtype = post.subtype;
	postEntry.title = post.title;	
	postEntry.tags = post.tags.split(',');
	postEntry.is_published = post.is_published;
	postEntry.content = post.content;

	postEntry.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}
		
		var data = {};
		data.status = 200;
		data.statusMessage = "Nove item publicado: " + postEntry.title;
		data.content = {};
		data.content.type = postEntry.type;
		data.content.subtype = postEntry.subtype;
		data.content.title = postEntry.title;		
		return res.send(data);
	});
};

exports.update = function(req, res) {
	if (!req.user) {
		return res.send(401);
	}

	var post = req.body.post;

	if (post == null || post._id == null) {
		res.send(400);
	}

	var updatePost = {};

	if (post.title != null && post.title != "") {
		updatePost.title = post.title;
	} 

	if (post.tags != null) {
		if (Object.prototype.toString.call(post.tags) === '[object Array]') {
			updatePost.tags = post.tags;
		}
		else {
			updatePost.tags = post.tags.split(',');
		}
	}

	if (post.is_published != null) {
		updatePost.is_published = post.is_published;
	}

	if (post.content != null && post.content != "") {
		updatePost.content = post.content;
	}

	updatePost.updated = new Date();

	db.pubModel.update({_id: post._id}, updatePost, function(err, nbRows, raw) {
		return res.send(200);
	});
};

exports.delete = function(req, res) {
	if (!req.user) {
		return res.send(401);
	}

	var id = req.params.id;
	if (id == null || id == '') {
		res.send(400);
	} 

	var query = db.pubModel.findOne({_id:id});

	query.exec(function(err, result) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		if (result != null) {
			result.remove();
			return res.send(200);
		}
		else {
			return res.send(400);
		}
		
	});
};

