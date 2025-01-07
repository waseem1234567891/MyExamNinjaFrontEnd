import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null); // Store the selected file
    const [message, setMessage] = useState(''); // Message for upload status
    const [isUploading, setIsUploading] = useState(false); // Uploading state

    // Handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle file upload
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please select a file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file); // Append file to form data

        try {
            setIsUploading(true); // Set uploading state
            setMessage(''); // Clear message before upload

            const response = await axios.post('http://localhost:8081/api/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Required for file uploads
                },
            });

            // Handle success response
            setMessage(response.data || 'File uploaded successfully!');
        } catch (error) {
            // Handle error response
        const errorMessage =
        error.response?.data?.message || // If `message` is a property in the error object
        JSON.stringify(error.response?.data) || // Convert the error object to a string
        'Failed to upload the file. Please try again.';
    setMessage(errorMessage);
        } finally {
            setIsUploading(false); // Reset uploading state
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Upload Questions</h1>
            <form onSubmit={handleUpload} style={styles.form}>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    style={styles.fileInput}
                />
                <button
                    type="submit"
                    disabled={isUploading}
                    style={isUploading ? styles.disabledButton : styles.button}
                >
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            </form>

            {/* Display the message */}
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
};

// Inline styles for the component
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '400px',
        margin: '0 auto',
        textAlign: 'center',
    },
    title: {
        marginBottom: '20px',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    fileInput: {
        marginBottom: '10px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    disabledButton: {
        padding: '10px 20px',
        backgroundColor: '#ccc',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'not-allowed',
    },
    message: {
        marginTop: '15px',
        color: '#555',
    },
};

export default FileUpload;
