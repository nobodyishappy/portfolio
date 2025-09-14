export const posts = [
    {
        slug: 'nm4259_blog_post_3',
		title: 'NM4259 Blog Post #3',
        coverImage: 'StickmanDrawing',
		contents: [
            {
                component: 'paragraph',
                data: {
                    text: `The week started before our Thursday lesson. Our team decided to meet to plan out the flow of the process that we are looking to improve. 
                    We chose the process of users after payment till collection of food. From our analysis, we found out the users were not able to estimate the time required from the number of people that is in queue at the store. 
                    On top of that, the application did not provide live updates on the current progress which makes the user uncertain of their order status.`
                }
            },
            {
                component: 'header',
                data: {
                    text: 'Meeting on Application Flow'
                }
            },
            {
                component: 'image',
                data: {
                    src: 'NM4259/ApplicationFlow.jpg',
                    alt: 'Application Flow'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `We decided to update the home screen to replace the what's in today slider with an order slider. Based on collected data, 
                    users do not really look at this region but immediately start with the selecting of their orders. 
                    We thought of removing it but we decided to replace it with a pop-up window such that they will be greeted with it during the first 
                    instance of opening the application for the day. We also decided to make the area retractable to allow more space for the user to choose their meal.`
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `We decided to replace that area with the current orders to allow for users a simpler and quicker way of viewing their current order. 
                    This region showcases the remaining time left, store name and order number which are the information that the users require the most. 
                    When there is no active order, it will display the past orders which allows for the user to order again. This functionality is to aid users as we discovered that some users order the same item every time.`
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `Another page that we changed was the order details page. The old page was just a timeline where the application would immediately show the first three would turn green as you enter the page. 
                    Then the user would not have any updates until the order is ready to collect. We split this page into two different modes. First, we decided to display the time remaining and the number of people ahead in queue. 
                    This would help the users to stay updated on their food status. The second page is displayed as soon as the food is ready for collection. 
                    This page shows the food item and its customization such that you can show the vendors during collection.`
                }
            },
            {
                component: 'header',
                data: {
                    text: 'Drawing of Lo-fi Wireframe'
                }
            },
            {
                component: 'image',
                data: {
                    src: 'NM4259/Wireframe.jpg',
                    alt: 'app rating'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `I was tasked to do up the wireframe for the proposed changes and some frames for the application flow. I used Krita to draw out the different frames without annotations. 
                    A lot of the design were copied from the current application. I only decided to modify the areas that we were planning to. 
                    The last change I did was the removal of the notification icon to shift it directly to the current order. An exclamation mark would appear and the status would change to ready.`
                }
            },
        ]
	},
    {
		slug: 'nm4259_blog_post_2',
		title: 'NM4259 Blog Post #2',
        coverImage: 'InterviewStickman',
		contents: [
            {
                component: 'paragraph',
                data: {
                    text: `After deciding on NUSmart Dining App as our interaction design of choice, we got started with the data collection process for user research. 
                    During class, our group had a discussion on which methods that we should use to collect data from our target audience. Our team considering between using the fly on the wall method or contextual inquiry. 
                    We decided to go with contextual inquiry as we wanted a method that would be able to get the most realistic and informational data from the users.`
                }
            },
            {
                component: 'header',
                data: {
                    text: 'Survey for User Research'
                }
            },
            {
                component: 'image',
                data: {
                    src: 'NM4259/Survey.png',
                    alt: 'survey'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `To add onto the contextual inquiry, we decided to do up a survey with some demographic based question to get some data on the usage, strengths and weaknesses of the application. 
                    We start the survey with a few demographic based questions to get some data on the users. Followed by some question on strength and weakness of the application. 
                    Ending off with a question on what the user recommends to be improved on for the application. 
                    After confirming the question on the form, we sent out the forms to get data on pain points for the application that we can work on.`
                }
            },
            {
                component: 'header',
                data: {
                    text: 'Contextual Inquiry on Users'
                }
            },
            {
                component: 'image',
                data: {
                    src: 'NM4259/CIVideo.gif',
                    alt: 'survey'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `On Friday, I manage to get a friend that has been using the application for a long time to do a contextual inquiry while he was ordering food at The Terrace. 
                    One thing that I found tough was to come up with the question to ask the user while they are using the application. As I am also a regular user of the application, 
                    I roughly knew the general process for the application itself. After getting through the CI, 
                    I conducted a post-interview with some questions like reasons for using the application and pros and cons of the application.`
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `I manage to get another friend which did not have any experience with the application at all. I wanted to know if a new user is able to use the application. 
                    One error that was brought up by the user was the fact that the location of The Terrace is incorrect. 
                    One interesting factor was the fact that the number of people in queue caught his attention when he was choosing a store to eat from. 
                    Overall, his experience with it was quite positive and smooth with some comments on the error and user interface.`
                }
            },
            {
                component: 'header',
                data: {
                    text: 'App reviews'
                }
            },
            {
                component: 'image',
                data: {
                    src: 'NM4259/AppRating.jpg',
                    alt: 'app rating'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `The final thing that I did was to look through the google play store reviews for the application. The overall rating for the application was 1.4-stars with 61 different ratings. 
                    Most of the written reviews were 1-star. The most recent reviews were done on October 2023. After looking through the reviews, 
                    the issue that was brought up the most was the login issues followed by the payment problems. However, there might been updates over the past two year which was able to fix the issue. 
                    The interesting thing I noticed was the showcase images has not been updated with the new user interface.`
                }
            },
        ]
	},
    {
		slug: 'nm4259_blog_post_1',
		title: 'NM4259 Blog Post #1',
        coverImage: 'Stickman',
		contents: [
            {
                component: 'paragraph',
                data: {
                    text: `This week marks the start of our group project where we are tasked to find a website/mobile application that we think that its functionality or design could be improved upon. 
                    After the designation of groups, our team decide to meet the day after to confirm the interaction design that we would like to look into. 
                    We tasked each other to come out with 2 to 3 websites/mobile application to share with the group. `
                }
            },
            {
                component: 'header',
                data: {
                    text: 'Idea of Recipe Site'
                }
            },
            {
                component: 'image',
                data: {
                    src: 'NM4259/Porchetta.jpg',
                    alt: 'porchetta'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `Before leaving the class, I recalled and shared a conversation that I had with one of my friends on a webpage design issue. This issue stems from standard layout for most recipe sites. 
                    The layout for most of these sites starts off with a detailed blog with images of the different steps and what to watch for then followed by the exact ingredient list and instruction steps. 
                    These led to some cumbersome interaction when following the website for the recipe with the constant requirement for scrolling to the different sections of the site.`
                }
            },
            {
                component: 'header',
                data: {
                    text: 'Personal Challange'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `Immediately after class, I was thinking and looking through my phone for some inspiration on the different application that could be interesting to share and improve on. 
                    This is where I encountered my first challenge. The challenge that I faced was the fact that I realised I mainly only look at apps for their functionality aspect rather than the aesthetic aspect of them. 
                    After combing through most of the apps on my phone, it really concreted this fact.`
                }
            },
            {
                component: 'header',
                data: {
                    text: 'Idea of EduRec'
                }
            },
            {
                component: 'image',
                data: {
                    src: 'NM4259/EduRec.jpg',
                    alt: 'edurec'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `To resolve this issue, I started off by asking some of my friends for any ideas on the topic. One of them suggested edurec which reminded me of the recent experience I had with the site itself. 
                    The experience was with the application for graduation process. This process requires us to start off by submitting a what-if report on our planned courses for the upcoming semester. 
                    The main issue I faced was with the course selection process. The course selection process consists of a selection of alphabets to select the first letter of your course code and followed by a dropdown to select your course. 
                    The worst part is that selecting causes the page to exit back and you will have to do the entire selection again.`
                }
            },
            {
                component: 'header',
                data: {
                    text: 'Group Meeting and Finalization'
                }
            },
            {
                component: 'image',
                data: {
                    src: 'NM4259/NUSDining.jpg',
                    alt: 'nusdining'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `Finally, our group met up on Friday to share our findings and discuss on the site/app that we would be choosing. During the sharing and discussion process, 
                    we decided to weight the advantages and disadvantages of each site/app with regards to the accessibility of our target audiences and the feasibility of the design change. 
                    After voting and further discussion, we decided to choose NUSmart Dining App as the interaction design that we would try to improve on. We proceeded to do up the write up to explain and elaborate why we decided on this application.`
                }
            },
        ]
	},
	{
		slug: 'nm4259_self_intro',
		title: 'NM4259 Self Introduction',
        coverImage: 'SnowedIn',
		contents: [
            {
                component: 'header',
                data: {
                    text: 'Short Introduction'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `I am a Year 4 student from the School of Computing. 
                        My major is in Computer Science and I am taking a Minor in Interactive Media Design.<br>
                        I have interest in 3D modeling and game development. From mobile to VR games, I have worked on different projects with various themes.`
                }
            },
            {
                component: 'header',
                data: {
                    text: 'What I hope to take away from the course?'
                }
            },
            {
                component: 'paragraph',
                data: {
                    text: `After taking a few design modules, I realised that I do not have enough exprience with 2D design. 
                        During my internship at Straits Times, this realization became more prominent and obvious.
                        I hope that this module would allow me to gain more insights on the different aspects of design and gain valuable feedback on my current designs.`
                }
            }
        ]
	},
];