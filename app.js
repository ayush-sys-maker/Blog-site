import express from "express";
import bodyparser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const apiUrl = "http://localhost:4000"


app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


//home page



app.get("/", (req, res) => {
  res.render("home.ejs");
});



app.get("/blogs", async (req, res) => {
try{
const posts = await axios.get(`${apiUrl}/posts`) 
console.log(posts.data);
res.render("blog.ejs", { posts: posts.data });
}catch (error) {
console.error("Error fetching posts:", error);
res.status(500).send("Error fetching posts");
}
})



// edit page

app.get("/new", (req, res) => {
  res.render("edit-form.ejs",{
    title:"NEW POST",
    submit:"Post Now"
  });
});


app.get("/edit/:id", async (req, res) => {

  try {
     const postId = parseInt(req.params.id);

    const post = await axios.get(`${apiUrl}/posts/${postId}`);
    console.log(post.data);
    res.render("edit-form.ejs", {
      submit: "Update",
      post: post.data
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).send("Error fetching post");
  }


})


app.post("/api/post/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const response = await axios.patch(`${apiUrl}/posts/${postId}`, req.body);
    console.log(response.data);
    res.redirect("/blogs");
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).send("Error updating post");
  }
})




//post 


app.post("/api/posts", async (req, res) => {
  try {
    const response = await axios.post(`${apiUrl}/posts`, req.body);
    console.log(response.data);
    res.redirect("/blogs");
  } catch (error) {
    res.status(500).json({ message: "Error creating post" });
  }
});


//delete post

app.get("/api/posts/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${apiUrl}/posts/${req.params.id}`);
    res.redirect("/blogs");
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});















