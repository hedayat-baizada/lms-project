export type CourseLevel = {
    title: string;
    courseDescription: string;
    objectives: string[];
    assessmentMethods: string[];
};

export const prepCelLevels: CourseLevel[] = [
    {
        title: 'English Time 1 — A1',
        courseDescription:
            'English Time 1 is designed for absolute beginners who are learning English for the first time. The course introduces basic vocabulary and simple language structures through songs, games, stories, dialogues, and interactive classroom activities. Students learn to understand and use every day English in familiar situations while developing confidence in listening and speaking.',
        objectives: [
            'Use basic greetings and classroom expressions.',
            'Introduce themselves and others.',
            'Identify numbers, colors, family members, animals, and common objects.',
            'Ask and answer simple questions.',
            'Read and write simple words and short sentences.',
            'Develop basic listening and pronunciation skills.',
        ],
        assessmentMethods: [
            'Class participation and attendance',
            'Homework assignments',
            'Vocabulary quizzes',
            'Speaking activities',
            'Midterm examination',
            'Final examination',
        ],
    },
    {
        title: 'English Time 2 — A2',
        courseDescription:
            'English Time 2 designed for students to expand their vocabulary and improve their ability to communicate using simple sentences. Lessons focus on everyday topics while strengthening listening, speaking, reading, writing, grammar, and pronunciation.',
        objectives: [
            'Describe people, places, and everyday objects.',
            'Talk about daily routines and personal preference.',
            'Ask and answer questions using simple grammar structures.',
            'Read short passages and identify key information.',
            'Write simple sentences and short paragraph.',
            'Improve confidence in everyday communication.',
        ],
        assessmentMethods: [
            'Class participation and attendance',
            'Homework assignments',
            'Grammar and vocabulary quizzes',
            'Speaking activities',
            'Midterm examination',
            'Final examination',
        ],
    },
    {
        title: 'English Time 3 — A3',
        courseDescription:
            'English Time 3 helps learners communicate more confidently using a wider range of vocabularies and grammar. Students practice all four languages skills through engaging activities based on real-life situations, improving both accuracy and fluency.',
        objectives: [
            'Talk about daily life, hobbies, school, and family.',
            'Use present and past form in simple conversations.',
            'Read and understand short texts.',
            'Write organized paragraphs using familiar vocabulary.',
            'Improve listening comprehension and pronunciation.',
            'Participate confidently in classroom discussions.',
        ],
        assessmentMethods: [
            'Class participation and attendance',
            'Homework assignment',
            'Vocabulary and grammar quizzes',
            'Reading and writing tasks',
            'Midterm examination',
            'Final examination',
        ],
    },
    {
        title: 'English Time 4 — A4',
        courseDescription:
            'English Time 4 is a communicative course for learners that develops reading, writing, listening and speaking skills through different various activities. This course students build vocabulary, grammar accuracy, pronunciation and confidence in everyday communication.',
        objectives: [
            'Develop reading, writing, listening and speaking skills.',
            'Use daily vocabulary related to common life topics.',
            'Improve grammar accuracy in sentences and short conversations.',
            'Develop reading comprehension and understanding of short texts.',
            'Write simple paragraphs using correct spelling and punctuation.',
            'Improve pronunciation through classroom interaction.',
        ],
        assessmentMethods: [
            'Class participation and attendance',
            'Homework Assignments',
            'Vocabulary and grammar exercises',
            'Listening and speaking activities',
            'Reading and writing tasks',
            'Midterm examination',
            'Interview test',
            'Final examination',
        ],
    },
    {
        title: 'English Time 5 — A5',
        courseDescription:
            'English Time 5 strengthens students’ English communication skills through interactive lessons and real-life language practice. The course covers topics such as culture, travel, technology, health and daily experiences. Students improves fluency, comprehension, writing and grammar through discussion, reading passages and other collaborative activities.',
        objectives: [
            'Communicate effectively using appropriate vocabulary and grammar.',
            'Read longer passages and identify main ideas and details.',
            'Write organized sentences and short paragraphs accurately.',
            'Improve fluent speaking and classroom participation.',
            'Develop critical thinking and cooperative learning skills.',
        ],
        assessmentMethods: [
            'Class participation and attendance',
            'Homework assignments',
            'Oral presentations and projects',
            'Grammar and writing tasks',
            'Interview test',
            'Midterm and final examinations',
        ],
    },
    {
        title: 'English Time 6 — A6',
        courseDescription:
            'English Time 6 is an advanced elementary English course that prepares students for more independent communication and higher-level English learning. The course includes topics such as education, future plans, science and social life. Students develop comprehension, fluency, writing and critical thinking through group projects, reading texts, discussion and practical communication activities.',
        objectives: [
            'Communicate confidently in spoken and written English',
            'Use expanded vocabulary and advanced grammar structures correctly',
            'Improve reading comprehension and analytical skills',
            'Write clear paragraphs and compositions with proper organization',
            'Apply English effectively in academic and real-life situations.',
        ],
        assessmentMethods: [
            'Class attendance and participation',
            'Homework assignments',
            'Speaking activities and oral presentations',
            'Individual and group projects',
            'Reading, writing, listening and speaking tasks',
            'Midterm examination',
            'Interview test',
            'Final examination',
        ],
    },
];

export const celLevels: CourseLevel[] = [
    {
        title: 'English File Beginner',
        courseDescription:
            'This course is designed for beginner learners with little prior knowledge of English. Using English File Beginner (4th Edition), students will develop basic communication skills through interactive activities that integrate speaking, listening, reading, writing, grammar, vocabulary, and pronunciation. The course introduces essential language for everyday situations, including greetings, personal information, family, daily routines, food, shopping, and travel. Students will build confidence in using simple English expressions and sentences in real-life contexts. Target Level: CEFR A1',
        objectives: [
            'Use basic English expressions in everyday situations.',
            'Introduce themselves and exchange personal information.',
            'Understand and produce simple spoken and written texts.',
            'Apply fundamental grammar structures and vocabulary.',
            'Develop accurate pronunciation and listening skills.',
        ],
        assessmentMethods: [
            'Class participation and attendance',
            'Homework assignments',
            'Vocabulary and grammar quizzes',
            'Speaking activities',
            'Midterm examination',
            'Final examination and/ or presentation',
        ],
    },
    {
        title: 'English File Elementary',
        courseDescription:
            'This course is intended for elementary learners who wish to strengthen their basic English skills for everyday communication. Using English File Elementary (4th Edition), students will develop confidence in speaking, listening, reading, and writing through communicative and student-centered activities. The course covers practical topics such as family, work, daily routines, shopping, travel, food, health, and leisure activities. Students will improve their ability to communicate in familiar situations using appropriate vocabulary and grammar. Target Level: CEFR A1–A2',
        objectives: [
            'Communicate in common daily situations.',
            'Understand simple spoken and written English.',
            'Use present, past, and future forms appropriately.',
            'Expand vocabulary related to everyday life.',
            'Improve pronunciation and conversational skills.',
        ],
        assessmentMethods: [
            'Participation and attendance',
            'Homework and assignments',
            'Vocabulary and grammar quizzes',
            'Speaking tasks and presentations',
            'Midterm examination',
            'Final examination and/ or presentation',
        ],
    },
    {
        title: 'English File Pre-Intermediate',
        courseDescription:
            'This course is designed for pre-intermediate learners who want to develop greater fluency and accuracy in English. Using English File Pre-Intermediate (4th Edition), students will strengthen their communication skills through interactive lessons and practical language tasks. Topics include travel, technology, relationships, education, health, and work. Students will learn to express opinions, describe experiences, and participate in conversations with increased confidence. Target Level: CEFR A2–B1',
        objectives: [
            'Communicate effectively in familiar and some unfamiliar situations.',
            'Express opinions and describe experiences.',
            'Use a wider range of grammar structures accurately.',
            'Expand vocabulary for social, academic, and professional contexts.',
            'Improve listening comprehension and pronunciation.',
        ],
        assessmentMethods: [
            'Class participation',
            'Homework assignments',
            'Quizzes',
            'Speaking activities and presentations',
            'Midterm examination or project',
            'Final examination and/ or presentation',
        ],
    },
    {
        title: 'English File Intermediate',
        courseDescription:
            'This course is intended for intermediate learners seeking to improve their English proficiency for academic, professional, and social purposes. Using English File Intermediate (4th Edition), students will develop fluency and accuracy through communicative activities and authentic materials. The course explores topics such as culture, technology, careers, education, travel, and global issues. Students will enhance their ability to discuss ideas, solve problems collaboratively, and understand more complex texts. Target Level: CEFR B1–B2',
        objectives: [
            'Participate actively in discussions and conversations.',
            'Understand authentic spoken and written materials.',
            'Use complex grammar structures effectively.',
            'Expand academic and professional vocabulary.',
            'Produce clear and organized written texts.',
        ],
        assessmentMethods: [
            'Participation and attendance',
            'Homework and assignments',
            'Vocabulary and grammar quizzes',
            'Speaking tasks',
            'Midterm examination or project',
            'Final examination and/ or presentation',
        ],
    },
    {
        title: 'English File Upper-Intermediate',
        courseDescription:
            'This course is designed for upper-intermediate learners who aim to refine their English skills for academic, professional, and intercultural communication. Using English File Upper-Intermediate (4th Edition), students will engage with authentic materials and participate in critical discussions on contemporary topics. The course focuses on developing advanced communication skills, critical thinking, and independent learning strategies. Students will express complex ideas with greater precision and confidence. Target Level: CEFR B2',
        objectives: [
            'Communicate fluently in a wide range of contexts.',
            'Analyze and discuss complex issues critically.',
            'Apply advanced grammatical structures accurately.',
            'Use academic and professional vocabulary effectively.',
            'Deliver organized presentations and written assignments.',
        ],
        assessmentMethods: [
            'Class participation',
            'Homework and online activities',
            'Quizzes and assignments',
            'Presentations and discussions',
            'Midterm examination and/ or project',
            'Final examination and/ or presentation',
        ],
    },
    {
        title: 'English File Advanced',
        courseDescription:
            'This course is intended for advanced learners who seek to achieve a high level of English proficiency for academic, professional, and international communication. Using English File Advanced (4th Edition), students will refine their language skills through authentic texts, critical analysis, presentations, and collaborative tasks. The course covers sophisticated topics related to culture, society, technology, global issues, and professional life. Students will develop the ability to communicate nuanced ideas accurately, confidently, and appropriately in diverse contexts. Target Level: CEFR C1',
        objectives: [
            'Communicate effectively and confidently in academic and professional settings.',
            'Understand and analyze complex spoken and written materials.',
            'Use advanced grammar and vocabulary with precision.',
            'Participate in debates, presentations, and critical discussions.',
            'Produce coherent and well-structured written texts.',
        ],
        assessmentMethods: [
            'Participation and attendance',
            'Homework and independent learning tasks',
            'Vocabulary and grammar assessments',
            'Midterm examination and/ or project',
            'Final examination, research paper, or presentation',
        ],
    },
];