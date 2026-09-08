import React, { useState } from "react";
import { contactStyles } from "../assets/dummyStyles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Popcorn,
  Send,
  Ticket,
} from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "").slice(0, 11);
      setFormData((prev) => ({ ...prev, phone: digits }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.phone || formData.phone.length < 10) {
      toast.error("⚠️ Please enter a valid phone number.");
      return;
    }

    const whatsappMessage = `Name: ${encodeURIComponent(
      formData.name,
    )}%0AEmail: ${encodeURIComponent(
      formData.email,
    )}%0APhone: ${encodeURIComponent(
      formData.phone,
    )}%0ASubject: ${encodeURIComponent(
      formData.subject,
    )}%0AMessage: ${encodeURIComponent(formData.message)}`;

    window.open(`https://wa.me/201157700392?text=${whatsappMessage}`, "_blank");
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className={contactStyles.pageContainer}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className={contactStyles.bgGradient}></div>
      <div className={contactStyles.bgBlob1}></div>
      <div className={contactStyles.bgBlob2}></div>

      {/* Film strip effect */}
      <div className={contactStyles.filmStripTop}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={contactStyles.filmStripSegment}></div>
        ))}
      </div>
      <div className={contactStyles.filmStripBottom}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={contactStyles.filmStripSegment}></div>
        ))}
      </div>

      <div className={contactStyles.contentContainer}>
        <div className={contactStyles.headerContainer}>
          <div className="inline-flex items-center justify-center mb-4">
            <h1 className={contactStyles.headerTitle}>
              <span className={contactStyles.headerTitleRed}>Contact </span>
              <span className={contactStyles.headerTitleWhite}>Us</span>
            </h1>
          </div>
          <p className={contactStyles.headerSubtitle}>
            Have questions about movie bookings or special events? Our team is
            here to help you.
          </p>
        </div>
        <div className={contactStyles.gridContainer}>
          <div className={contactStyles.cardRelative}>
            {/* التوهج الخلفي للكارت */}
            <div className={contactStyles.cardGradient}></div>

            {/* حاوي الكارت الرئيسي */}
            <div className={contactStyles.cardContainer}>
              {/* شارة التذكرة في الأعلى */}
              <div className={contactStyles.cardBadge}>
                <Ticket className={contactStyles.cardIcon} />
                <span>BOOKING SUPPORT</span>
              </div>

              {/* عنوان الـ Form مع أيقونة الرسالة */}
              <h2 className={contactStyles.formTitle}>
                <MessageCircle className={contactStyles.formTitleIcon} />
                Send us a Message
              </h2>

              {/* نموذج الإدخال */}
              <form onSubmit={handleSubmit} className={contactStyles.form}>
                <div className={contactStyles.formGrid}>
                  <div>
                    <label htmlFor="name" className={contactStyles.inputGroup}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={contactStyles.input}
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={contactStyles.inputGroup}>
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={contactStyles.input}
                      placeholder="Your@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className={contactStyles.inputGroup}>
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    className={contactStyles.input}
                    placeholder="Your Phone Number"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className={contactStyles.inputGroup}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={contactStyles.select}
                  >
                    <option
                      value=""
                      disabled
                      className="bg-gray-900 text-gray-400"
                    >
                      Select a subject
                    </option>
                    <option
                      value="Ticket Booking"
                      className="bg-gray-900 text-white"
                    >
                      Ticket Booking
                    </option>
                    <option
                      value="Group Events"
                      className="bg-gray-900 text-white"
                    >
                      Group Events
                    </option>
                    <option
                      value="Membership"
                      className="bg-gray-900 text-white"
                    >
                      Membership Inquiry
                    </option>
                    <option
                      value="Technical Issue"
                      className="bg-gray-900 text-white"
                    >
                      Technical Issue
                    </option>
                    <option value="Refund" className="bg-gray-900 text-white">
                      Refund Request
                    </option>
                    <option value="Other" className="bg-gray-900 text-white">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className={contactStyles.inputGroup}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className={contactStyles.textarea}
                    placeholder="Please describe your inquiry in details..."
                  ></textarea>
                </div>

                <button type="submit" className={contactStyles.submitButton}>
                  <span>Send Via WhatsApp</span>
                  <Send className="w-5 h-5 ml-2 shrink-0" />
                </button>
              </form>
            </div>
          </div>
          <div className="space-y-6">
            <div className={contactStyles.cardRelative}>
              <div className={contactStyles.cardGradient}></div>
              <div className={contactStyles.cardContainer}>
                <div className={contactStyles.cardBadge}>
                  <Popcorn className={contactStyles.cardIcon} />
                  CINEMA INFO
                </div>
                <h2 className={contactStyles.formTitle}>Contact Information</h2>
                <div className={contactStyles.contactInfo}>
                  <div className={contactStyles.contactItem}>
                    <div className={contactStyles.contactIconContainer}>
                      <Phone className={contactStyles.contactIcon} />
                    </div>
                    <div>
                      <h3 className={contactStyles.contactText}>
                        Booking Hotline
                      </h3>
                      <p className={contactStyles.contactDetail}>
                        +91 8299431275
                      </p>
                    </div>
                  </div>

                  <div className={contactStyles.contactItem}>
                    <div className={contactStyles.contactIconContainer}>
                      <Mail className={contactStyles.contactIcon} />
                    </div>
                    <div>
                      <h3 className={contactStyles.contactText}>
                        EMAIL ADDRESS
                      </h3>
                      <p className={contactStyles.contactDetail}>
                        booking@contact.com
                      </p>
                      <p className={contactStyles.contactDetail}>
                        support@cineplex.com
                      </p>
                    </div>
                  </div>

                  <div className={contactStyles.contactItem}>
                    <div className={contactStyles.contactIconContainer}>
                      <MapPin className={contactStyles.contactIcon} />
                    </div>
                    <div>
                      <h3 className={contactStyles.contactText}>
                        Main Theater Location
                      </h3>
                      <p className={contactStyles.contactDetail}>
                        123 Cinema street, Film City, Mumbai, Fc 400001
                      </p>
                      <p className={contactStyles.contactDetail}>
                        +4 other Location across the city
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Emergency Support Card */}
            <div className={contactStyles.cardRelative}>
              <div className={contactStyles.emergencyCardGradient}> </div>
              <div className={contactStyles.emergencyCard}>
                <h3 className={contactStyles.emergencyTitle}>
                  <Phone className={contactStyles.emergencyIcon} />
                  Urgent Show Related Issues
                </h3>
                <p className={contactStyles.emergencyText}>
                  For urgent issues during a movie screening (sound, projection,
                  etc.)
                </p>
                <div className="flex items-center">
                  <div className={contactStyles.emergencyHotline}>
                    HOTLINE: +91 8299431275
                  </div>
                  <span className={contactStyles.emergencyNote}>
                    Available during showtimes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
