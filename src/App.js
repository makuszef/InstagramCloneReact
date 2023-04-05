import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post.js';
import {db, auth} from './firebase';
import Modal from '@material-ui/core/Modal';
import {makeStyles} from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const modalStyle = useStyles();

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
    if (authUser) {
      //user has loggend in
      console.log(authUser);
      setUser(authUser);

    } else {
      setUser(null);
    }

   
    
  })

  return () => {
    // perfom some cleanup
    unsubscribe();
  }
}, [user, username]);

  useEffect(() => {
    //pulls values from db
    db.collection('posts').orderBy("timestamp", 'desc').onSnapshot(snapshot =>{
      //every time new post is added 
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) =>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => 
    alert(error.message));
    setOpen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))
    setOpenSignIn(false);
  }

  return (

    <div className="app">
      
      
      <Modal
        open={open}
        onClose={() => setOpen(false)} // when u click outside the modal it setOpen=>false
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img
            className="app__headerImage"
              src="https://png.pngtree.com/element_our/md/20180626/md_5b321ca3631b8.jpg"
              alt="image"
              height='30'
              width='30'
            />
            </center>
            <Input
            type="text"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            />
            <Input
            type="text"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signUp}>Sign up</Button>
            </form>

          
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)} // when u click outside the modal it setOpen=>false
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img
            className="app__headerImage"
              src="https://png.pngtree.com/element_our/md/20180626/md_5b321ca3631b8.jpg"
              alt="image"
              height='30'
              width='30'
            />
            </center>
          
            <Input
            type="text"
            value={email}
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type='submit' onClick={signIn}>Sign in</Button>
            </form>

          
        </div>
      </Modal>

      <div className="app__header">
        <img src="https://i.pinimg.com/originals/95/04/64/950464fcbb88221fba2d72bd8e997118.png"
         width='20' 
         alt="image"
         height='20'
         className="app__headerImg"
        />
        {user ? ( // if user is signed up
        <Button onClick={() => auth.signOut()}>Logout</Button>
      ): ( //else
        <div className="qpp__loginContainer">
          <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
          <Button onClick={() => setOpen(true)}>Sign up</Button>
        </div>
      )}
      </div>
      
        <div className="app__posts">
          <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post 
              key={id}
              postId={id}
              username={post.username} 
              caption={post.caption} 
              ImageUrl={post.ImageUrl}
              user={user}
              />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          
          />
        </div>
      </div>

      

      <div className="app__imageupload">
        {user?.displayName ? (
          <ImageUpload username={user.displayName}/>
        ): (
          <h3>Sorry u need to login to upload</h3>
        )}
      </div>

    </div>
  );
}

export default App;
