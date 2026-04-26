/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import Schools from "./pages/Schools";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import SubjectContent from "./pages/SubjectContent";
import ClassManagement from "./pages/ClassManagement";
import CurriculumPreparation from "./pages/CurriculumPreparation";
import LessonEditor from "./pages/LessonEditor";
import ClassGrades from "./pages/ClassGrades";
import Messages from "./pages/Messages";
import Homework from "./pages/Homework";
import ParentPortal from "./pages/ParentPortal";
import CurriculumGenerator from "./pages/CurriculumGenerator";
import Resources from "./pages/Resources";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="schools" element={<Schools />} />
          <Route path="student" element={<StudentDashboard />} />
          <Route path="student/homework" element={<Homework />} />
          <Route path="teacher" element={<TeacherDashboard />} />
          <Route path="teacher/curriculum" element={<CurriculumPreparation />} />
          <Route path="teacher/lesson-editor" element={<LessonEditor />} />
          <Route path="teacher/lesson-editor/:id" element={<LessonEditor />} />
          <Route path="teacher/grades" element={<ClassGrades />} />
          <Route path="coordinator" element={<CoordinatorDashboard />} />
          <Route path="coordinator/class" element={<ClassManagement />} />
          <Route path="subject" element={<SubjectContent />} />
          <Route path="messages" element={<Messages />} />
          <Route path="parent" element={<ParentPortal />} />
          <Route path="generator" element={<CurriculumGenerator />} />
          <Route path="resources" element={<Resources />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
