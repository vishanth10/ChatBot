import React, { useState } from 'react';
import axios from 'axios';

const DataIngestion = () => {
  const [service, setService] = useState('GOOGLE_DRIVE');
  const [oauthUrl, setOauthUrl] = useState('');
  const [dataSources, setDataSources] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleGetOauthUrl = async () => {
    try {
      const response = await axios.get(`/get_oauth_url`, { params: { service } });
      setOauthUrl(response.data.oauth_url);
    } catch (error) {
      console.error('Error fetching OAuth URL', error);
    }
  };

  const handleListDataSources = async () => {
    try {
      const response = await axios.get('/list_user_data_sources');
      setDataSources(response.data.data_sources);
    } catch (error) {
      console.error('Error listing data sources', error);
    }
  };

  const handleListFiles = async () => {
    try {
      const response = await axios.get('/list_files', { params: { service } });
      setFiles(response.data.files);
    } catch (error) {
      console.error('Error listing files', error);
    }
  };

  const handleListUploadedFiles = async () => {
    try {
      const response = await axios.get('/list_uploaded_files', { params: { service } });
      setUploadedFiles(response.data.uploaded_files);
    } catch (error) {
      console.error('Error listing uploaded files', error);
    }
  };

  const handleSearchDocuments = async () => {
    try {
      const fileIds = uploadedFiles.map(file => file.id);
      const response = await axios.post('/search_documents', { query, file_ids: fileIds });
      setSearchResults(response.data.search_results);
    } catch (error) {
      console.error('Error searching documents', error);
    }
  };

  return (
    <div>
      <h1>Data Ingestion</h1>
      <div>
        <label>Select Data Source:</label>
        <select value={service} onChange={(e) => setService(e.target.value)}>
          <option value="GOOGLE_DRIVE">Google Drive</option>
          <option value="DROPBOX">Dropbox</option>
          <option value="NOTION">Notion</option>
        </select>
        <button onClick={handleGetOauthUrl}>Get OAuth URL</button>
        {oauthUrl && (
          <div>
            <a href={oauthUrl} target="_blank" rel="noopener noreferrer">Authenticate</a>
          </div>
        )}
      </div>
      <div>
        <button onClick={handleListDataSources}>List Data Sources</button>
        <ul>
          {dataSources.map(ds => (
            <li key={ds.id}>
              ID: {ds.id}, External ID: {ds.external_id}, Type: {ds.type}, Sync Status: {ds.sync_status}, 
              Created At: {ds.created_at}, Updated At: {ds.updated_at}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleListFiles}>List Files</button>
        <ul>
          {files.map(file => (
            <li key={file.name}>{file.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <button onClick={handleListUploadedFiles}>Show Uploaded Files</button>
        <ul>
          {uploadedFiles.map(file => (
            <li key={file.id}>
              ID: {file.id}, Organization Supplied User ID: {file.organization_supplied_user_id}, 
              Organization User Data Source ID: {file.organization_user_data_source_id}, 
              External URL: <a href={file.external_url} target="_blank" rel="noopener noreferrer">{file.external_url}</a>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query"
        />
        <button onClick={handleSearchDocuments}>Search</button>
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>
              Source: {result.source}, Source URL: <a href={result.source_url} target="_blank" rel="noopener noreferrer">{result.source_url}</a>, 
              Source Type: {result.source_type}, Presigned URL: <a href={result.presigned_url} target="_blank" rel="noopener noreferrer">{result.presigned_url}</a>, 
              Tags: {JSON.stringify(result.tags)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DataIngestion;
