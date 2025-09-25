import React from 'react';
import { CourseHead } from './CourseHead';
import {CourseTop } from './CourseTop';
import Title from '../common/title/title';
export const CourseHome = () => {
  return (
    <>
      <Title subtitle='Top courses' title='our top courses' />
     <CourseHead /> 
     <CourseTop />
    </>
  )
}


    