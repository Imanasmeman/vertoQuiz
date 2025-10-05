import React, { useState } from "react";
import Header from "./header";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Footer from "./footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // 👉 Here you can integrate backend API / Email service
    alert("Thank you! Your message has been sent.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 px-6 py-12 flex flex-col items-center">
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Contact Us
          </h1>
          <p className="text-gray-600 text-center mb-10">
            Have questions, feedback, or need support? We’d love to hear from you!
          </p>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left - Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-blue-600" />
                <p className="text-gray-700">support@quizapp.com</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-green-600" />
                <p className="text-gray-700">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-6 h-6 text-pink-600" />
                <p className="text-gray-700">Ahmedabad, Gujarat, India</p>
              </div>
            </div>

            {/* Right - Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
