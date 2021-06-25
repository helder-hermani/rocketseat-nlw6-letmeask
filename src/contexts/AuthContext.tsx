import {createContext, useEffect} from 'react';
import { useState } from 'react';

import firebase from 'firebase/app';
import {auth} from '../services/firebase';
import { ReactNode } from 'react';

type UserType ={
    id: string;
    name: string;
    avatar: string;
  }
  
  type AuthContextType = {
    user: UserType | undefined;
    signInWithGoogle: ()=>Promise<void>;
  }

  type AuthContextProviderProps ={
      children: ReactNode;
  }

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps){
    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (user){
            const {displayName, photoURL, uid} = user;
      
            if (!displayName || !photoURL){
              throw new Error("Missing information from Google Account");
            }
      
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL
            })
          }
        })
        return () => {
          unsubscribe();
        }
      }, []);
    
      const [user, setUser] = useState<UserType>();
    
      async function signInWithGoogle(){
        const provider = new firebase.auth.GoogleAuthProvider();
    
        const result = await auth.signInWithPopup(provider);
    
        if (result.user){
          const {displayName, photoURL, uid} = result.user;
    
          if (!displayName || !photoURL){
            throw new Error("Missing information from Google Account");
          }
    
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL
          })
    
          console.log(result);
        }
      }
    
    return (
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    )
}