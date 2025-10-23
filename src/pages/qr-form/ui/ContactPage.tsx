import { ContactForm } from '@/features/contact-form'; // Formani 'features' qatlamidan olamiz

const ContactPage = () => {
  return (
    // Sahifaga ozgina stil beramiz, chiroyliroq ko'rinishi uchun
    <div className="w-full min-h-screen bg-[var(--color-neutral-100)] p-4 sm:p-6 lg:p-8">
      <ContactForm />
    </div>
  );
};

export default ContactPage;
