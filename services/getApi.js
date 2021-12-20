import firebase from 'react-native-firebase'

export const getApiFirebase = (item) => {
    return firebase.database().ref(item).once('value')
}

export const pushFirebase = (path, data) => {
    return firebase.database().ref(path).push(data);
}

export const setFirebase = (path, data) => {
    return firebase.database().ref(path).set(data);
}

export const removeFirebase = (path, key) =>{
    return firebase.database().ref(path).child(key).remove();
}

export const getApi = (url) => {
    return fetch(url)
            .then((res) => res.json());
}
