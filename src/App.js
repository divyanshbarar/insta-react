import { Button, Fade, Input, makeStyles, Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import { auth, db } from './Firebase';
import ImageUpload from './ImageUpload';
import Post from './Post';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }

}
const useStyles = makeStyles((theme) => ({

  paper: {
    position: 'absolute',
    width: 300,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);

  const [userName, setUserName] = useState('');

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false)


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
        // if (authUser.displayName) {
        //   //dont update username
        // }
        // else {
        //   return authUser.updateProfile({
        //     displayName: userName,
        //   })
        // }
      }
      else {
        setUser(null);
      }
    })
    return () => {
      unsubscribe()
    }
  }, [user, userName])



  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => (
      setPosts(snapshot.docs.map(doc => (
        {
          id: doc.id,
          post: doc.data()
        }
      )))
    ))
  }, [])

  const signUp = (Event) => {
    Event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: userName
        })
      })
      .catch((error) => alert(error.message))
    //to close modal
    setOpen(false)
  }

  const signIn = (Event) => {
    Event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="App">
    




      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <Fade in={open}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signUp">
              <center>
                <img className="app__headerImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHCF7_fsvhs8B5DoMI3ndNX3naQ8gh6kp1Ig&usqp=CAU" alt="" />

                <Input
                  placeholder="Username"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />

                <Input
                  placeholder="Email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <br />
                <Button variant="contained" color="primary" onClick={signUp}>Sign Up</Button>

              </center>
            </form>

          </div>
        </Fade>
      </Modal>


      {/* signin modal */}

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <Fade in={openSignIn}>
          <div style={modalStyle} className={classes.paper}>
            <form className="app__signUp">
              <center>
                <img className="app__headerImage" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHCF7_fsvhs8B5DoMI3ndNX3naQ8gh6kp1Ig&usqp=CAU" alt="" />


                <Input
                  placeholder="Email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <br />
                <Button variant="contained" color="primary" onClick={signIn}>Sign In</Button>







              </center>
            </form>

          </div>
        </Fade>
      </Modal>


      {/* Header */}

      <div className="app__header">
        <div className="app__headerFont">
        <img src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt=""
          className="app__headerImage" />
          <p>By Divyansh Barar</p>
        </div>
       

{user ? (
        <Button color="secondary" variant="outlined" onClick={() => auth.signOut()}>Logout</Button>

      ) : (
        <div className="app__loginContainer">
          <Button color="primary" variant="outlined" onClick={() => setOpenSignIn(true)}>Sign In</Button>

          <Button color="primary" variant="outlined" onClick={() => setOpen(true)}>Sign Up</Button>

        </div>

      )}
      </div>

        {/* post bnana */}

        {user?.displayName ? (<ImageUpload userName={user.displayName} />

) : (
  <div className="uploaderText">
 <h3 >Login To Upload</h3>
  </div>
 
)}

  

      {/* Posts */}
      {/* key=id will make the single post get refreshed which is uploaded  */}
      {
        posts.map(({ id, post }) => (
          <Post key={id} user={user} postId={id} userName={post.userName} caption={post.caption} imageUrl={post.imageUrl} />

        ))

      }





    </div>
  );
}

export default App;
