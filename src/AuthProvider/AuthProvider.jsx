// import Swal from "sweetalert2";
// import PropTypes from 'prop-types';
import auth from "../Firebase/Firebase.config";
const googleProvider = new GoogleAuthProvider();
import { createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";

export const AuthContext = createContext(null)

const AuthProvider = ({children}) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    // regiter user or sign up
    const registerUser = (email,password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password);
    }

    // sign in with google
    const signInGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }

    // log in user
    const logInUser = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    // update profile 
    const updateProfileFromUser = (name, photoURL) => {
        console.log(name, photoURL, 'provider')
        return updateProfile(auth.currentUser, {
            displayName: name, 
            photoURL: photoURL,
        });
    }
    
    // objerver on user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged (auth, currentUser => {
            setUser(currentUser);
            setLoading(false)
        } )
        return () => unsubscribe()
    },[]);

     // log out 
     const logOut = () => {
        setLoading(true)
        return signOut (auth)
        .then((result) => {
            console.log(result.user, 'result log out');
          }).catch((error) => {
            console.error(error,'error from log out');            
          });
    }

    // All value 
    const userInfo = {user, loading, registerUser, signInGoogle, logInUser, logOut, updateProfileFromUser };

    return (
        <AuthContext.Provider value={userInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;