/*
    Get all published posts
*/
app.get('/post', routes.posts.list);
/*
    Get all posts
*/
app.get('/post/all', jwt({secret: secret.secretToken}), routes.posts.listAll);
 
/*
    Get an existing post. Require url
*/
app.get('/post/:id', routes.posts.read);
 
/*
    Get posts by tag
*/
app.get('/tag/:tagName', routes.posts.listByTag);
 
/*
    Login
*/
app.post('/login', routes.users.login);
 
/*
    Logout
*/
app.get('/logout', routes.users.logout);
 
/*
    Create a new post. Require data
*/
app.post('/post', jwt({secret: secret.secretToken}), routes.posts.create);
 
/*
    Update an existing post. Require id
*/
app.put('/post', jwt({secret: secret.secretToken}), routes.posts.update);
 
/*
    Delete an existing post. Require id
*/
app.delete('/post/:id', jwt({secret: secret.secretToken}), routes.posts.delete);
