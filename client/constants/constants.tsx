type onboardingSwiperDataType = {
    id: number;
    title: string;
    description: string;
    shortDescription: string;
    image: string;
};

export const onboardingSwiperData: onboardingSwiperDataType[] = [
    {
        id: 1,
        title: 'Your Personalized Learning Management System',
        description: 'Your personalized learning management system designed to streamline your educational experience. ',
        shortDescription: ' Streamlined Learning for All.',
        image: require('../assets/intro2.jpg')
    },
    {
        id: 2,
        title: 'Access All Your Educational Resources in One Place',
        description: 'This Learning Portal provides a comprehensive platform for all your educational needs.',
        shortDescription: 'Your Educational Resource Hub.',
        image: require('../assets/intro5.jpg')
    },
    {
        id: 3,
        title: 'Empowering Your Learning Journey',
        description: 'Explore courses, participate in discussions, and achieve your learning goals with our user-friendly platform.',
        shortDescription: 'Empower Your Learning.',
        image: require('../assets/intro3.jpg')
    },
    {
        id: 4,
        title: 'Simplifying Education for Teachers and Students',
        description: 'TeachNet simplifies education for both teachers and students. ',
        shortDescription: 'Simplifying Education.',
        image: require('../assets/intro4.jpg')
    },
    {
        id: 5,
        title: 'Elevate Your Skills and Knowledge',
        description: 'Engage with interactive content, connect with classmates, and enhance your educational journey.',
        shortDescription: ' Streamlined Learning for All.',
        image: require('../assets/intro1.jpg')
    },
]