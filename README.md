# Background

Bring up the phrase "STARS Wars" to any NTU student and the respond would be universal - frustration and anger. 
STARS refer to a course bidding system provided by NTU in which students engages in two major activity 
    - to plan their upcoming semester time table
    - to bid and secure their courses

The reason why its a war for students could be attributed to the fact that everyone has to fight for their modules and not all will survive (failed to secure the module they wish to take).

The NTU STARS System has been a major pain point to NTU Students for decades and unfortunately not much have been done to alleviate it. Starting from the planning phase, student aonly have access to a timetable planning tool that is slow, unintuitive and inefficient. A typical student in NTU takes around 6 modules per semester and each modules have dozens of indexes (possible time slots). As a result, Students often find themselves spending hours going through dozens or even hundrends of different indexes,exacerbated by the fact that each index can only be loaded once at a time, in order to find a suitable timetable. Its alos a good time to bring up that each student would have to plan around 3 timetables in an event that they failed to secure the module they want.

All this equates to a huge drain of studnets time just to plan for their semester.

Although, the bidding portion is a also major pain point for students, improving this require tweaking and improving NTU internal system which is not feasible without any official collaboration.

Hence, this project aims to provide a tool for NTU students to plan their timetable in a effective, simplified manner.


## Identifying the cause
Planning a timetable first requires student to add the modules they are interested in. Afterwhich, students would have to painstakingly iterate through each index for each module to find a timetable that is clash free and to their preference (no lessons on a particular day, morning/afternoon lessons). Given that each module have dozens or even hundreds of indexes, a simple calculation shows that students have thousands of possible timetable combination to go through before finding suitable ones. Thousands.

With that surfaced, eliminating the process of interating through each index for all modules is a must. To achieve that, an overview of how a module indexes will fit into a studnet's timetable would suffice. To inform student which classes or in the same index, a simple hover effect would be intuitive.

## Developing the solution

### Overview of technologies and concepts used
#### Tech Stack (NTU Stars)
Vue3
Pinia (Similar to VueX)
Firebase

#### Scraper
Puppeteer
Node.js
Firebase Functions (Serverless API)

#### Diagram

a


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
