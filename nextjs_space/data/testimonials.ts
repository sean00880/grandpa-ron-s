
import { Testimonial } from '../types';

export const testimonials: Testimonial[] = [
  {
    customer: 'Luke Buccholz',
    rating: 5,
    location: 'Canal Winchester, OH',
    quote: 'Had them out several times, and let me tell you they did a fantastic job on my yard! I had been using other services for a while, and the job would get done. However it was usually never done to my standards. These guys take the time to get it right, and make sure the job is actually completed. Will give 5 stars, and my business for the foreseeable future!'
  },
  {
    customer: 'Chelsie Casagrande',
    rating: 5,
    location: 'Pickerington, OH',
    quote: 'We had a great experience with the team at Grandpa Ron\'s. They were fast, great with communication and produced quality work. They gave our house and yard the tune up it needed! Highly recommend.'
  },
  {
    customer: 'Nick B',
    rating: 5,
    location: 'Columbus, OH',
    quote: 'Found Grandpa Ron\'s last spring. I needed the grass cut because my mower wouldn\'t start. He arrived that day and was able to cut and trim the whole yard. Have also used him to cut grass on another property we own in town. Always let\'s me know when he will be there and when it is completed. Highly recommend!'
  },
  {
    customer: 'Sarah M',
    rating: 5,
    location: 'Groveport, OH',
    quote: 'Professional, reliable, and affordable. Grandpa Ron\'s team transformed our overgrown backyard into a beautiful outdoor space. Their attention to detail is unmatched!'
  },
  {
    customer: 'Michael R',
    rating: 5,
    location: 'Reynoldsburg, OH',
    quote: 'Best landscaping service in the area! They mulched our entire property and it looks amazing. Fair pricing and exceptional quality. Will definitely use them again.'
  }
];

export const getTestimonialsByLocation = (location: string): Testimonial[] => {
  return testimonials.filter(t => t?.location?.toLowerCase().includes(location.toLowerCase()));
};
