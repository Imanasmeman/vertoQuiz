import { Facebook, Twitter, Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between md:items-center gap-8">
        {/* Branding */}
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-extrabold tracking-tight">
            VertoQuiz
          </h2>
          <p className="mt-1 text-gray-300 max-w-sm">
            Engage, Learn, & Challenge yourself with our dynamic quizzes.
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 md:justify-start">
          <a
            href="/Dashboard"
            className="hover:text-indigo-400 transition-colors font-medium"
          >
            Dashboard
          </a>
          <a
            href="/about-user"
            className="hover:text-indigo-400 transition-colors font-medium"
          >
            Profile
          </a>
          <a
            href="/about"
            className="hover:text-indigo-400 transition-colors font-medium"
          >
            About
          </a>
          <a
            href="/contact"
            className="hover:text-indigo-400 transition-colors font-medium"
          >
            Contact
          </a>
        </nav>

        {/* Social Icons */}
        <div className="flex justify-center md:justify-end gap-5 text-gray-300">
          <a
            href="mailto:support@quizplatform.com"
            aria-label="Email"
            className="hover:text-white transition-colors"
          >
            <Mail size={24} />
          </a>
          <a
            href="https://github.com/yourgithub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-white transition-colors"
          >
            <Github size={24} />
          </a>
          <a
            href="https://twitter.com/yourtwitter"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-white transition-colors"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://linkedin.com/in/yourlinkedin"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-white transition-colors"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://facebook.com/yourfacebook"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-white transition-colors"
          >
            <Facebook size={24} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-indigo-700 text-center text-gray-400 py-4 text-sm">
        &copy; {new Date().getFullYear()} Quiz Platform. All rights reserved.
      </div>
    </footer>
  );
}
