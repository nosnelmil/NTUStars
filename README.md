<p align='center'>
<img src="./assets//NTUStars-icon.png" alt="icon" width="45"/>
</p>


# NTUStars
<img src="./assets//NTUStars.png" alt="drawing"/>

Find it here! [NTUStars](https://www.ntustars.com)


# Background

Bring up the phrase "STARS Wars" to any NTU student and the respond would be universal - frustration and anger. 
STARS refer to a course bidding system provided by NTU in which students engages in two major activity 
    - to plan their upcoming semester time table
    - to bid and secure their courses <br>

I have talked about the background more indepth on linkedin so follow the link if you would like to find out more! [LinkedIn](https://www.linkedin.com/posts/lenson-lim-05974621b_during-the-semester-break-i-finally-attempted-activity-7100377614392950784-J8Md?utm_source=share&utm_medium=member_desktop) <br>

In sumamry, this project aims to solve a decade old problem by providing a tool for NTU students to plan their timetable in a effective, simplified manner.

# Architecture
<img src="./assets//NTUStars-archi.png" alt="Architecture"/>

Frontend Repository: [NTUStars App](https://github.com/Lebarnon/BetterNotesApp) <br>
Backend Repository: [NTUStars Server](https://github.com/Lebarnon/BetterNotesServer) 


### **Frontend: Vue3 + Pinia** <br>
For the frontend, I utilised Vue3 composition api and managed most of the application state using Pinia. If you are familiar with React, Pinia is like React Redux. <br> 
Most of the application logic lies within the 3 stores I have: <br>
<ol>
  <li>Schedules Store</li>
  The schedules store main job is to interact with my serverless APIs and format incoming data into a structure I want for my specific use cases in the frontend.
  <li>Timetable Store</li>
  The timetable stores contains all functionality related to the actual time table itself. Be it adding courses, remove, previewing etc...
  On hindset, I should have really done this in Typescript but refactoring at this point was a lot of work. Instead, I brought the lessons learnt to this project:
  
[BetterNotes](https://github.com/Lebarnon/BetterNotesApp)

  <li>Settings Store</li>
  Settings store contains all the settings related stuff in the app like dark mode.
</ol> 

### **Backend: Firebase**
Firebase functions was used as my severless server mainly due to its always free tier (Great for my pocket).<br>
This project could actually be done entire on the frontend but I really wanted to play around with a serverless architecture and to hide crucial "business logic".

The overall logic in firebase functions is as follows:<br><br>
**User request for data** 

Validate request --> Check firestore for requested data --> If have return data from firestore --> Else start scraping service (see) --> clean & format scraped data --> save into firestore --> return data

**Scraping Service**

[NTU Class Schedule](https://wish.wis.ntu.edu.sg/webexe/owa/aus_schedule.main) is where I get course timetable data<br>
[NTU Content of Courses](https://wis.ntu.edu.sg/webexe/owa/aus_subj_cont.main) is where I get data on course information like the course description. <br><br>
Not sure why they must have separate website for different information. So based on the request and using [Puppeteer](https://pptr.dev/), I first had to analyse the html structure of the website, find the appropriate information I want using a variety of CSS selector and finally return it to be formatted in whatever way i deemed fit to be saved in firestore.


# Considerations
For anyone who might be curious, these are just some of my considerations and throught processes during this project

## Identifying the Issue
Planning a timetable first requires student to add the modules they are interested in. Afterwhich, students would have to painstakingly iterate through each index for each module to find a timetable that is clash free and to their preference (no lessons on a particular day, morning/afternoon lessons). Given that each module have dozens or even hundreds of indexes, a simple calculation shows that students have thousands of possible timetable combination to go through before finding suitable ones. Thousands.

The most intuitive idea is to help generate all possible combinations and students just need to select their ideals one.

However, existing attempts to solve this problem already involve timetable generators, but through testing and feedback, they often fall short due to the complexity of personal preferences. To truly simplify the process, I recognized the need for flexibility without sacrificing simplicity.

## Developing the solution
Here is the consolidated and summarised considerations:

**Current Solutions**: Existing attempts to solve this problem involve timetable generators, but they often fall short due to the complexity of personal preferences.To truly simplify the process, I recognized the need for flexibility without sacrificing simplicity.
<br>

**Value**: I was aware that my solution needed to be significantly better than current options that students are familiar with to be truly valuable. This meant optimizing load times, modernizing the user interface while maintaining familiarity, and significantly streamlining the planning process. <br>

**Cost**: As this project would ultimately be intended for the community, cost-efficiency was essential. Therefore, there was a need to strike a balance between different cloud providers and their solutions that would allow me to scale the project comfortably.
<br>

**Requirements**: I used a simple litmus test which was to constantly ask, "Would I use it?". Asides from that, there was also a need to continuously seek feedback and user testing from my peers as NTU students were after all the key stakeholders.

All in all the result was NTUStars! The journey was definitely rewarding and I've learnt so much because I was able to take the time to understand what's going on, explore other possibilities and just simply test out any ideas I had.