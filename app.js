var express =require('express');
var mongoose=require('mongoose');
var app = express();
var bodyParser=require('body-parser');
var expressLayouts = require('express-ejs-layouts');
var password= "7176";
var multer  = require('multer');

var upload = multer({ dest: './public/uploads/' });
mongoose.connect("mongodb://localhost/blog-heraldistas");

const blazonSchema={
  name: String,
  description: String,
  pic_path      : String,
  pic_name      : String
};
var Blazon = mongoose.model("Blazon", blazonSchema);

var path = require('path');


app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", (req, res)=>{

    res.render("index");
});

app.get("/heraldry", (req, res)=>{
  console.log("FuncionA");
  res.render("show");
});


app.get("/blasones", (req, res)=>{
  console.log("Blasones funcionando");
  res.render("blazons");
});

// crear descripción Heráldica
app.get("/new", (req, res)=>{
  console.log("menu form funcionando");
    res.render("blasones/new");
});

app.post("/new", upload.single ( 'photo' ), (req, res)=>{
  var data={
    name:req.body.name,
    description:req.body.description,
     pic_path: `/uploads/${req.file.filename}`,
     pic_name: req.file.originalname
  };
  var blazon = new Blazon(data);
  blazon.save(function(err){
    console.log(blazon);
  });
  console.log(req.body);
  res.redirect("/");
});


// ruta menú donde están las descripciones heráldicas
app.get("/menu", (req, res)=>{
  Blazon.find(function(error, documento){
    if(error){console.log(error);}
    res.render("blasones/diseños", {blazons: documento});
  });
});

app.get("/admin", (req, res)=>{
  Blazon.find(function(error, documento){
    if(error){console.log(error);}
    res.render("admin/form", {blazons: documento});
  });
});
app.post("/admin", (req, res)=>{
  if (req.body.password == password){
    Blazon.find((error, documento)=>{
      if(error){console.log(error);}
      res.render("admin/index", {blazons: documento});
    });
  }else{
    res.redirect("/");
  }
});

// Descripción de un sólo blasón

app.get("/:id", (req, res)=>{

  Blazon.findOne({"_id": req.params.id}, (error, blason)=>{

    res.render("blasones/blason", {blazon: blason});
  });
});

app.get("/menu/:id", (req, res)=>{

  Blazon.findOne({"_id": req.params.id}, (error, blason)=>{

    res.render("admin/blason", {blazon: blason});
  });
});

// Editar id de cada Blasón

app.get("/menu/:id/edit", (req, res)=>{
 var blasonaco = req.params.id;
  Blazon.findById(blasonaco, (error, blason)=>{

    res.render("menu/edit", {blazon: blason});
  });
});


app.post("/menu/:id", (req, res, next)=>{
  var blasonacoId = req.params.id;
  var editatum={
    name:req.body.name,
    description:req.body.description
  };
  console.log(editatum);
  //Blazon.findByIdAndUpdate(id, editatum, function(error, blason){
  Blazon.findByIdAndUpdate(blasonacoId, editatum, (error, blason)=>{
   res.redirect('/menu');

  });
});



//admin

app.get("/admin/:id/edit", (req, res)=>{
 var blasonacoAdmin = req.params.id;
  Blazon.findById(blasonacoAdmin, (error, blason)=>{

    res.render("admin/edit", {blazon: blason});
  });
});


app.post("/admin/:id", (req, res, next)=>{
  var blasonacoAdminId = req.params.id;
  var editatumAdmin={
    name:req.body.name,
    description:req.body.description
  };
  console.log(editatumAdmin);
  Blazon.findOneAndUpdate(blasonacoAdminId, editatumAdmin, (error, blason)=>{
   res.redirect('/admin');

  });
});


app.get( "/admin/:id/delete", (req, res) =>{
  var id = req.params.id;
  Blazon.findByIdAndRemove(id,  (err, blason)=> {
    if (err) { return next (err); }
    return res.redirect ( "/menu");
  });
});
/*app.get("/menu/:id/edit", function(req, res){

  Blazon.findOne({"_id": req.params.id}, function(error, blason){

    res.render("menu/edit", {blazon: blason});
  });
});


app.post("/menu/:id", function(req, res, next){
//  var id = req.params.id;
  var editatum={
    name:req.body.name,
    description:req.body.description
  };
  console.log(editatum);
  //Blazon.findByIdAndUpdate(id, editatum, function(error, blason){
  Blazon.findOneAndUpdate(req.params.id, editatum, function(error, blason){
   res.redirect('/menu');

  });
});
*/
//delete

app.get( "/:id/delete", (req, res) =>{
  var id = req.params.id;
  Blazon.findByIdAndRemove(id,  (err, blason)=> {
    if (err) { return next (err); }
    return res.redirect ( "/menu");
  });
});


// Zona admin

// Administrador antiguo
/*
app.get("/admin", function(req, res){
  res.render("admin/form");
});


app.post("/admin", function(req, res){
  if (req.body.password == password){
    Blazon.find(function(error, adminity){
      if(error){console.log(error);}
      res.render("admin/index", {blason: adminity});
    });
  }else{
    res.redirect("/");
  }
});

//editar admin

app.get("/admin/:id/edit", function(req, res){
  var id_blason = req.params.id;
  Blazon.findOne({"_id": id_blason}, function(error, adminity){

    res.render("admin/edit", {admins: adminity});
  });
});


app.post("admin/:id", function(req, res){
  var id={
    name:req.body.name,
    description:req.body.description
  };
  Blazon.Update({"_id": res.params.id}, function(){
    console.log(blason);
    res.redirect("/");
  });
});
app.get ( "/admin/:id/delete", function (req, res) {
  var id = req.params.id;
  Blazon.findByIdAndRemove(id, function (err, adminity) {
    if (err) { return next (err); }
    return res.redirect ( "/admin");
  });
});

*/




// Eliminado de descripciones

/*app.get("/menu/delete/:id", function(req, res){
  var id_blason = req.params.id;
  Blazon.findById(id_blason, function(error, blazon){
    res.redirect("/menu");
  });
});*/



/*
app.delete('/:id/delete', function(req, res) {
  var id = req.params.id;

  Blazon.findOnAndRemove(id, function (err, documento) {
    if (err){ return next(err); }
    return res.redirect('/');
  });

});*/

app.listen(3000);
