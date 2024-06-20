import requests

BASE_URL = "http://127.0.0.1:5000"

def test_get_oauth_url(service):
    url = f"{BASE_URL}/get_oauth_url"
    payload = {"service": service}
    headers = {'Content-Type': 'application/json'}
    response = requests.request("POST", url, json=payload, headers=headers)
    print(f"GET OAUTH URL ({service}):")
    print(response.text)
    print("")

def test_list_user_data_sources():
    url = f"{BASE_URL}/list_user_data_sources"
    headers = {'Content-Type': 'application/json'}
    response = requests.request("POST", url, headers=headers)
    print("LIST USER DATA SOURCES:")
    print(response.text)
    print("")

def test_list_files(service):
    url = f"{BASE_URL}/list_files"
    payload = {"service": service}
    headers = {'Content-Type': 'application/json'}
    response = requests.request("POST", url, json=payload, headers=headers)
    print(f"LIST FILES ({service}):")
    print(response.text)
    print("")

# def test_list_uploaded_files(service):
#     url = f"{BASE_URL}/list_uploaded_files"
#     payload = {"service": service}
#     headers = {'Content-Type': 'application/json'}
#     response = requests.request("POST", url, json=payload, headers=headers)
#     print(f"LIST UPLOADED FILES ({service}):")
#     print(response.text)
#     print("")

# def test_search_documents(query, file_ids):
#     url = f"{BASE_URL}/search_documents"
#     payload = {"query": query, "file_ids": file_ids}
#     headers = {'Content-Type': 'application/json'}
#     response = requests.request("POST", url, json=payload, headers=headers)
#     print("SEARCH DOCUMENTS:")
#     print(response.text)
#     print("")

# # Example usage
if __name__ == "__main__":
    # Test getting OAuth URL for Google Drive
    test_get_oauth_url("GOOGLE_DRIVE")

    # Test listing user data sources
    test_list_user_data_sources()

    # Test listing files in Google Drive
    test_list_files("GOOGLE_DRIVE")

#     # Test listing uploaded files in Google Drive
#     #test_list_uploaded_files("GOOGLE_DRIVE")

#     # Test searching documents with a dummy query and file IDs
#     #dummy_file_ids = [12345, 67890]  # Replace with actual file IDs
#     test_search_documents("sample query", dummy_file_ids)
