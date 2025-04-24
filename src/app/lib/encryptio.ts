
const bcrypt = require('bcryptjs');;

import {createSession } from "./session"
import { redirect } from "next/navigation";


// A function to hash a password with bcrypt
export async function encryptPassword(password:string) {
  const saltRounds = 1; // Use 1 round to make it as fast as possible (not recommended for production)
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

// Function to compare a password to an encrypted hash
export async function comparePasswords(password : string, hash:string) {
  const match = await bcrypt.compare(password, hash);
  return match;
}

export async function login(array :  Array<{
  id: number;
  email: string;
  password: string;
}>, password: string) {
  const userData = {
    id:  array[0].id, 
    email: array[0].email,
    password: array[0].password,
  };

  if(! await comparePasswords(password,userData.password)){
   

  } else {
   
    createSession(userData.email, userData.id);


    redirect("/dashboard");   
  }
}


 

