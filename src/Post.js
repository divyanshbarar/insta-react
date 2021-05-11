import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import "./Post.css"
import Avatar from '@material-ui/core/Avatar';
import { db } from './Firebase';
import firebase from "firebase"

function Post(props) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(props.postId).collection("comments").add({
            text: comment,
            userName: props.user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }
    useEffect(() => {
        let unsubscribe;
        if (props.postId) {
            unsubscribe = db.collection("posts")
                .doc(props.postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc =>
                        doc.data()
                    )))
                })
        }
        return () => {
            unsubscribe();
            // setComments("")
        }
    }, [props.postId])
    return (
        <div className="post__outer">


            <div className="post">
                <div className="post__header">
                    <Avatar className="post__avatar" alt={props.userName} src="/static/images/avatar/1.jpg" />
                    <h3>{props.userName}</h3>

                </div>

                <br />
                <img className="post__image" src={props.imageUrl} alt="" />
                <h4 className="post__text"><strong>{props.userName}:</strong> {props.caption}</h4>
                <div className="post__comments">
                    {comments.map((comment) => (
                        <p>
                            <b>{comment.userName} :</b> {comment.text}
                        </p>
                    )

                    )}
                </div>
                <div>
                    {props.user && (

                        <form className="commentBox">
                            <input
                                className="post__input"
                                type="text"
                                placeholder="Add a comment.."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button className="post__button"
                                disabled={!comment}
                                type="sumbit"

                                onClick={postComment}>
                                Post
</button>
                        </form>

                    )}

                </div>
            </div>
        </div>
    )
}

Post.propTypes = {

}

export default Post

