### Try it!
https://admin-hub-sepia.vercel.app/dashboard
###
Test user - admin credentials
```
Email: benmartinson92@gmail.com
Password: Test123!
```

#
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/ed5cd92e-d8f3-4c29-9f34-9602d7259e55" />

---

<img width="1434" alt="image" src="https://github.com/user-attachments/assets/f111106d-1ecb-4c93-b749-835bc2b83669" />


#### AdminHub Repo

https://github.com/benmartinson/AdminHub

#### Description

The idea behind this app is to empower a school admin to control completely the software that powers their school. They own the code to the 'Gradebook' because it's open source. They would create their own repo that is a fork of the original, in order to customize the Gradebook to fit the needs of their specific school.

The 'AdminHub' would not be open source, the admin would sign up to use it, but it helps them manage the 'Gradebook' code. They manage all the data and customizations used by the Gradebook. 

---

### Admin Tools
##### Customizations
Admins can keep track of all the settings that are available for the Gradebook. The Gradebook fetches these settings and conditionally renders based on them. The idea is that the admin would add settings and then would actually change the Gradebook code to account for them. They can also choose to allow the teacher to switch on/off these settings from within the gradebook (not yet implemented).

<img width="808" alt="image" src="https://github.com/user-attachments/assets/94cd0a59-d48a-45ae-a8ab-a7fa9c4be029" />

##### School data (not yet implemented fully)

Admins will be able to create and manage all data that is used by the Gradebook. Such as classes, grading periods, assignments, grades, etc. A future feature idea is to allow creation of new tables, schemas changes/additions from within the app.

##### Code change reporting (not yet implemented)

Admins will be able to see code changes they make in their Gradebook repo (implemented with Github actions), if they choose to, to help them keep track what needs to be done and what past changes have been made to the code. They will also see requests for changes from the teachers, who can report bugs or request new features.

##### Gradebook Users (not yet implemented)

The Gradebook will have users, teachers and also students, that can login and see the custom UI's that the admin has created. The admin will control user accounts from AdminHub.

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

#### How it works
[Convex ](https://www.convex.dev/) is used to create a realtime connection between the frontend and the backend (of both applications). This is what allows the smooth updates between the AdminHub, and the Gradebook running in the iframe. If this was used by a real school, they would need to setup their own convex account and Gradebook fork. They would then configure it within the AdminHub 'setup' tab. 
