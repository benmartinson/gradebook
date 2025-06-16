### Gradebook Demo Link
https://gradebook-three.vercel.app/class/jn7b7h4tb5vm4std60sfddkjfn7f9yb9/gradebook
User Credentials:
```
Email: benmartinson92@gmail.com
Password: Test123!
```
---

<img width="1920" alt="image" src="https://github.com/user-attachments/assets/297a1b25-85ba-4714-b6cb-30412bcb9070" />

---

#### SchoolAdmin Repo (More details about the project here)

https://github.com/benmartinson/AdminHub

### SchoolAdmin Demo Link
https://school-admin-sepia.vercel.app/dashboard/view

Admin credentials (different user, same credentials just for easy testing)
```
Email: benmartinson92@gmail.com
Password: Test123!
```

#### Class Assistant
The main feature idea I had for this Gradebook was a 'Class Assistant' chatbot that can perform all necessary CRUD actions for the teacher. It can add, delete and update assignments, and batch update grades. The interesting caveat is that the school admin can control which of these actions it's allowed to do. This is done from the SchoolAdmin administrator portal and is accomplished by changing the system prompt that given to the model. 

The system prompt includes all the data associated with the currently viewed class, a list of actions it's allowed to do, as well as a list of actions that are not allowed to do, and finally an output chat response format that is required when the user asks it to perform an action. The system prompt can be viewed in this file.

<img width="1475" alt="Screenshot 2025-06-15 at 6 26 03 PM" src="https://github.com/user-attachments/assets/3b532bc0-58a7-4cdd-a9e9-37a41991bc9c" />

When the model outputs the 'confirm action' format, then a confirmation view is shown to the user, and the user must confirm each action listed. This back and forth, avoids incorrect/unintended outputs from the model from taking affect. 

<img width="773" alt="image" src="https://github.com/user-attachments/assets/1b6caed2-5a11-4f8b-9099-d4d79899e5d8" />

 
#### Run locally
```
npm install
```
then run front end server:
```
npm run dev:frontend
```
and backend on a different terminal tab:
```
npm run dev:backend
```
