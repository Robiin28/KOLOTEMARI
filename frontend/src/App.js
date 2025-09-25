import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './MainLayout';
import { Home } from './components/home/Home';
import { About } from './components/About/About';
import { Course } from './components/course/Course';
import { Team } from './components/lecturer/Team';
import { Pricing } from './components/pricing/Pricing';
import { Contact } from './components/contact/Contact';
import { HomeLanding } from './components/homePage/HomeLanding';
import { SpecficCourse } from './components/course/specfic/SpecficCourse';
import { Lecture } from './components/course/Learn/Lecture';
import { Quiz } from './components/course/course-detail/quiz/QuizData';
import { Profile } from './components/course/profile/profile';
import { AdminDashboard } from './components/course/admin/AdminDashboard';
import { Page } from './components/Page';
import CourseDetail from './components/course/course-detail/CourseDetail';
import { Cart } from './components/cart/Cart';
import { RootLayout } from './components/course/Learn/RootLayout';
import InstructorDashboard from './components/Instructor/InstructorDashboard';
import PaymentPage from './components/PaymentPage';
import PaymentSuccessPage from './components/PaymentSuccessPage';
import PaymentStatus from './components/PaymentStatus';
import Signup from './components/auth/Signup';
import Signin from './components/auth/Signin';
import ProtectedRoute from './components/ProtectedRoute';
import AccountValidationPage from './components/auth/AccountValidationPage';
import SuccessMessagePage from './components/auth/SuccessMessagePage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="course" element={<Course />} />
          <Route path="team" element={<Team />} />
          <Route path="price" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="specfic-course" element={<SpecficCourse />} />
          <Route path="course-detail" element={<CourseDetail />} />
          
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="try" element={<Page />} />

         
          
        </Route>
        <Route path="land/*" element={<ProtectedRoute><HomeLanding /></ProtectedRoute>}>
          
            <Route path="instructor" element={<InstructorDashboard />} />

           
           
           
          </Route>
        {/* Learn routes */}
        <Route path="/learn" element={<ProtectedRoute><RootLayout /></ProtectedRoute>}>
          <Route path="lecture" element={<Lecture />} />
        </Route>

        {/* Payment routes */}
        <Route path="/pay" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
        <Route path="/payment-status" element={<ProtectedRoute><PaymentStatus /></ProtectedRoute>} />

        {/* Admin and Instructor Dashboard routes */}
        <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        {/* Quiz route */}
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />

        {/* Auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/validate" element={<AccountValidationPage />} />
        <Route path="/success" element={<SuccessMessagePage />} />
      </Routes>
    </Router>
  );
};

export default App;
