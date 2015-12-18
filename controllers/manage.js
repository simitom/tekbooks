'use strict';
var Book = require('../models/bookModel');
var Category = require('../models/categoryModel');

//get the books page
module.exports = function (router) {
   router.get('/books', function (req, res) {
        Book.find({}, function(err, books){
        	if(err){
        		console.log(err);
        	}
        	var model = {
        		books:books	
        	};

        	res.render('manage/books/index', model);
        });
    });

   //manage index page
    router.get('/', function (req, res) {
        res.render('manage/index');  
    });


    //get categories
     router.get('/categories', function (req, res) {
     	Category.find({}, function(err, categories){
        	if(err){
        		console.log(err);
        	}
        	var model = {
        		categories:categories	
        	};
        res.render('manage/categories/index',model);  
      });
    });

      //get the added book
     router.get('/books/add', function (req, res){
        Category.find({}, function(err, categories){
            if(err){
                console.log(err);
            }

            var model ={
                categories: categories
            };

            res.render('manage/books/add', model);
        });
     });
      
      //post the new added books
     router.post('/books', function (req, res){
        var title =req.body.title && req.body.title.trim();
        var category =req.body.category && req.body.category.trim();
        var author =req.body.author && req.body.author.trim();
        var publisher =req.body.publisher && req.body.publisher.trim();
        var price =req.body.price && req.body.price.trim();
        var description =req.body.description && req.body.description.trim();
        var cover =req.body.cover && req.body.cover.trim();

        if (title === ' ' || price === ' '){
            req.flash('error','please fill out the required fields');
            res.location('/manage/books/add');
            res.redirect('/manage/books/add');
        }

        if (isNaN(price)){
            req.flash('error','price must be a number');
            res.location('/manage/books/add');
            res.redirect('/manage/books/add');
        }

        //create the new book
        var newBook = new Book({
            title :title,
            category: category,
            description: description,
            author: author,
            publisher: publisher,
            cover: cover,
            price: price
        });

        //save the book into db
        newBook.save(function(err){
            if(err){
                console.log('save error', err);
            }

            req.flash('success', 'Book added');
            res.location('/manage/books');
            res.redirect('/manage/books');
        });

     });

    //display the edit form (same as add)
    router.get('/books/edit/:id',function (req, res){
        Category.find({}, function (err, categories){
            Book.findOne({_id:req.params.id}, function (err, book){
                if(err){
                    console.log(err);
                }
                var model ={
                    book: book,
                    categories:categories
                };

                res.render('manage/books/edit', model);
            });
        });
    });

    //edit the book
    router.post('/books/edit/:id', function (req, res){
        var title =req.body.title && req.body.title.trim();
        var category =req.body.category && req.body.category.trim();
        var author =req.body.author && req.body.author.trim();
        var publisher =req.body.publisher && req.body.publisher.trim();
        var price =req.body.price && req.body.price.trim();
        var description =req.body.description && req.body.description.trim();
        var cover =req.body.cover && req.body.cover.trim();


        //update books
        Book.update({_id: req.params.id},{
            title :title,
            category: category,
            description: description,
            author: author,
            publisher: publisher,
            cover: cover,
            price: price

        }, function(err){
            if(err){
                console.log('update error',err);
            }
                req.flash('success', 'Book Updated');
                res.location('/manage/books');
                res.redirect('/manage/books');
        });

    });
        //delete book
        router.delete('/books/delete/:id', function (req, res){
            Book.remove({_id:req.params.id}, function(err){
                if (err){
                    console.log(err);
                }
                req.flash('success', 'book deleted');
                res.location('/manage/books');
                res.redirect('/manage/books');
            });
        });

        //display category add form
        router.get('/categories/add', function (req, res){
            res.render('manage/categories/add');
        });

        // add new category
        router.post('/categories', function(req, res){
            var name = req.body.name && req.body.name.trim();

            if(name == ' '){
                req.flash('error', 'please fill out required fields');
                res.location('/manage/categories/add');
                res.redirect('/manage/categories/add');
            }

            var newCategory = new Category({
                name: name
            });

            newCategory.save(function (err){
                if (err){
                    console.log('save error', err);
                }

                req.flash('success', 'category added');
                res.location('/manage/categories');
                res.redirect('/manage/categories');

            });
        });

        //display category edit form
        router.get('/categories/edit/:id', function (req, res){
            Category.findOne({_id:req.params.id}, function(err,category){
                if(err){
                    console.log(err);
                }

                var model ={
                    category:category
                };

                res.render('manage/categories/edit', model);
            });
        });

        //edit category
        router.post ('/categories/edit/:id' ,function (req, res){
            var name = req.body.name && req.body.name.trim();

            Category.update({_id:req.params.id},{
                name:name
            }, function (err){
                if(err){
                    console.log('update error', err);
                }
                req.flash('success', 'category updated');
                res.location('/manage/categories');
                res.redirect('/manage/categories');
            });
        });

                //delete category
        router.delete('/categories/delete/:id', function (req, res){
            Category.remove({_id:req.params.id}, function(err){
                if (err){
                    console.log(err);
                }
                req.flash('success', 'category deleted');
                res.location('/manage/categories');
                res.redirect('/manage/categories');
            });
        });

};

