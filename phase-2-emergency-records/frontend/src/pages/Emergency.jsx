import React, { useState, useEffect } from 'react';

export default function Emergency() {
  // 1️⃣ Default emergency numbers (always visible)
  const defaultContacts = [
    { name: 'Nearest Hospital', number: '108' },
    { name: 'Fire Brigade', number: '101' },
    { name: 'Police', number: '100' },
    { name: 'Women Helpline', number: '1091' },
    { name: 'Child Helpline', number: '1098' },
    { name: 'Ambulance', number: '102' },
    { name: 'Disaster Management', number: '1070' },
  ];

  // 2️⃣ State for custom contacts added by user
  const [customContacts, setCustomContacts] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  // 3️⃣ Load saved custom contacts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sosCustomContacts');
    if (saved) setCustomContacts(JSON.parse(saved));
  }, []);

  // 4️⃣ Add new contact logic
  const addContact = () => {
    if (!newName || !newNumber) return alert('Please enter name and number');
    if (!/^\d{10}$/.test(newNumber)) return alert('Number must be 10 digits');

    const newContact = { name: newName, number: newNumber };
    const updated = [...customContacts, newContact];
    setCustomContacts(updated);
    localStorage.setItem('sosCustomContacts', JSON.stringify(updated));

    setNewName('');
    setNewNumber('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Emergency SOS Contacts</h2>

      {/* 5️⃣ Display Default Contacts */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {defaultContacts.map((c, i) => (
          <li key={'default-' + i} style={{ marginBottom: 8 }}>
            <a
              href={`tel:${c.number}`}
              style={{
                textDecoration: 'none',
                color: '#fff',
                background: '#d33',
                padding: '8px 12px',
                borderRadius: 4,
              }}
            >
              {c.name} — {c.number}
            </a>
          </li>
        ))}
      </ul>

      {/* 6️⃣ Display Custom Contacts */}
      {customContacts.length > 0 && (
        <>
          <h3 style={{ marginTop: 20 }}>Custom Contacts</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {customContacts.map((c, i) => (
              <li key={'custom-' + i} style={{ marginBottom: 8 }}>
                <a
                  href={`tel:${c.number}`}
                  style={{
                    textDecoration: 'none',
                    color: '#fff',
                    background: '#555',
                    padding: '8px 12px',
                    borderRadius: 4,
                  }}
                >
                  {c.name} — {c.number}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* 7️⃣ Add New Contact Form */}
      <h3 style={{ marginTop: 20 }}>Add Custom Contact</h3>
      <input
        placeholder="Name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        style={{ marginRight: 6 }}
      />
      <input
        placeholder="10-digit Number"
        value={newNumber}
        onChange={(e) => setNewNumber(e.target.value)}
        style={{ marginRight: 6 }}
      />
      <button onClick={addContact}>Add</button>
    </div>
  );
}
