import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './createNotes.css';

const CreateNotes = () => {
  const [note, setNote] = useState({
    title: "",
    content: "",
    date:  new Date().toISOString().split('T')[0], // Setting current date as default,
  });

  const [file, setFile] = useState(null);
  const [ocrText, setOcrText] = useState('');

  const history = useNavigate();

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  const onChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('tokenStore');
    console.log(token);

    await axios.post('/api/ocr/upload', formData, {
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      setOcrText(response.data.text);
      setNote({ ...note, content: response.data.text });
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };

  const createNote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('tokenStore');
      if (token) {
        const { title, content, date } = note;
        const newNote = {
          title,
          content,
          date,
        };

        await axios.post('/api/notes', newNote, {
          headers: { Authorization: token },
        });

        history.push('/');
      }
    } catch (err) {
      window.location.href = "/";
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

  return (
    <div className="create-note">
      <h2>Create note</h2>
      
      <form onSubmit={createNote} autoComplete='off'>
        <div className="row">
          <label htmlFor="title">Title</label>
          <input type="text" id='title' name="title"
            value={note.title} required onChange={onChangeInput}
          />
        </div>

        <div className="row">
          <label htmlFor="content">Content</label>
          <textarea cols="30" rows="10" type="textarea" id='content' name="content"
            value={note.content} required onChange={onChangeInput}
          ></textarea>
        </div>

        <label htmlFor="date">Date: {formatDate(note.date)}</label>
        <div className="row-date">
          <input type="date" id='date' name="date" value={note.date} required onChange={onChangeInput} />
        </div>

        <button type='submit'>Save</button>
      </form>

      <div>
        <h2>Upload File for OCR</h2>
        <form onSubmit={onSubmitFile}>
          <div>
            <input type="file" onChange={onChangeFile} />
          </div>
          <button type="submit">Upload</button>
        </form>
        {ocrText && (
          <div>
            <h3>Extracted Text</h3>
            <p>{ocrText}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNotes;
