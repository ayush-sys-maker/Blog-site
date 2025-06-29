import express from "express";
import bodyparser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Blog site',
  password: '987654',
  port: 5432,
});
db.connect();


// Middleware
app.use(bodyparser.json());
app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }));






/* VIEW POST   */

app.get("/posts", async (req,res)=>{
    
const result = await db.query("Select * from blogs ORDER BY id DESC");

res.json(result.rows);

})





app.get("/posts/:id", async (req, res) => {
  
  const postId = parseInt(req.params.id);

  const result = await db.query("SELECT * FROM blogs WHERE id = $1", [postId]);

  const post = result.rows[0];
  res.json( post || { error: "Post not found" });
  
})



/*  CREATE POST   */

app.post("/posts", async  (req,res)=>{

  const { title, textcontent } = req.body;

  const result = await db.query("INSERT INTO blogs (title, textcontent) VALUES ($1, $2) RETURNING *", [title, textcontent]);

  const newPost = result.rows[0];

  res.status(201).json(newPost);
  
})




/*  EDIT  */

app.patch("/posts/:id", async  (req,res)=>{
    let post_id = parseInt(req.params.id);
    const { title, textcontent } = req.body;
    const result = await db.query("UPDATE blogs SET title = $1, textcontent = $2 WHERE id = $3 RETURNING *", [title, textcontent, post_id]);
   res.json(result.rows[0]);
})





/*  DELETE  */

app.delete("/posts/:id", async (req, res) => {
  const postId = parseInt(req.params.id);
  const result = await db.query("DELETE FROM blogs WHERE id = $1 RETURNING *", [postId]);
  res.json(result.rows[0]);
});


    
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

