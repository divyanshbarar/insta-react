import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { storage, db } from './Firebase';
import firebase from "firebase"
import './ImageUpload.css'

function ImageUpload({userName}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null)
    const [progress, setprogress] = useState(0)


    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setprogress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message)
            },
            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection("posts").add({
                        timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                        caption:caption,
                        imageUrl:url,
                        userName:userName
                    });

                    setprogress(0);
                    setCaption("")
                    setImage(null)
                })
            }
        )


    }


    return (
        <div className="image__upload">
            <progress value={progress} max="100"/>
            <input type="text" placeholder="Enter Your Caption"
                value={caption} onChange={Event => setCaption(Event.target.value)}
            />
            <input type="file" onChange={handleChange} />
            <Button color="secondary" variant="contained" onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
