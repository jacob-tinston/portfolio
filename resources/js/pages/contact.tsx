import { ContactSection } from '@/components/contact-section';
import { Head } from '@inertiajs/react';

export default function Contact() {
    return (
        <>
            <Head title="Contact" />
            <ContactSection title="Say hello" showNewsletter standalone />
        </>
    );
}
