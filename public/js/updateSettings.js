import axios from "axios";
import { showAlert } from "./alert";

export const updateSettings = async (data, type) => {
    try {
        const url = type === 'data' ? 'http://localhost:8000/api/v1/users/update-my-data'
            : 'http://localhost:8000/api/v1/users/update-my-password'
        const res = await axios({
            method: 'PATCH',
            url: url,
            data: data
        })

        if(res.data.status === 'success'){
            showAlert('success', "Profile updated successfully");
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
    
}