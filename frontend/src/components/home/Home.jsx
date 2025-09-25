
import React from 'react';
import { MyHome } from './MyHome';
import { About } from '../About/About';
import { CourseTop } from '../course/CourseTop';
import {TeamHome} from '../lecturer/TeamHome';
import { AddHome} from '../additional/AddHome';
import {Faq} from './Faq';

export const Home = () => {


  return (
    <>
       <MyHome/>
       <About />
       <CourseTop />
       <AddHome />
       <TeamHome />
       <Faq />
      
    </>
  );
};
