// Comprehensive Mission-Specific Phone Apps Data System for PhoneSimulator.jsx
// Supports all 8 character keys with authentic Indian cyber-threat data (Messages, Gallery, Call Log, Notifications)

export const phoneAppsData = {
  father: {
    deviceName: "Father's Samsung Galaxy M34",
    owner: "Ramesh Sharma (Tea Stall Owner)",
    wallpaper: "bg-gradient-to-b from-stone-950 via-amber-950/70 to-slate-950",
    notifications: [
      {
        id: "notif_f1",
        app: "SMS",
        sender: "Airtel SIM Advisory",
        title: "CRITICAL SECURITY WARNING",
        time: "Just now",
        preview: "Warning: Dialing *401* will forward all your incoming calls and SMS (including OTPs) to another number."
      }
    ],
    messages: [
      {
        id: "msg_f1",
        sender: "Airtel SIM Advisory",
        avatar: "📶",
        phone: "121",
        timestamp: "10:40 AM",
        unread: true,
        preview: "Warning: Dialing *401* will forward all your incoming calls and SMS (including OTPs) to another number.",
        thread: [
          { sender: "them", text: "CRITICAL SECURITY WARNING: Beware of strangers requesting you to dial *401*<Number>! Dialing *401* activates unconditional call forwarding on your SIM card, forwarding all your incoming calls and SMS (including OTPs) to another number." }
        ]
      },
      {
        id: "msg_f2",
        sender: "Frantic Stranger",
        avatar: "🏃🏽‍♂️",
        phone: "+91 98765-43210",
        timestamp: "10:42 AM",
        unread: true,
        preview: "Bhaiyya, please! My wife is in the hospital. Can you urgently dial *401*9876543210 for me?",
        thread: [
          { sender: "them", text: "Bhaiyya, please! My wife is in the hospital. Can you urgently dial *401*9876543210 for me? My battery is dead!" }
        ]
      }
    ],
    gallery: [
      {
        id: "gal_f1",
        title: "Tea Stall Savings Ledger",
        src: "/comics/father_stall.png",
        date: "Today 08:00 AM",
        caption: "Daily sales register photo showing tea stall savings of ₹45,000.",
        isEvidence: false
      }
    ],
    callLog: [
      { id: "call_f1", name: "Frantic Stranger", number: "+91 98765-43210", type: "incoming", time: "10:45 AM", duration: "0s", isSpam: true },
      { id: "call_f2", name: "Milk Supplier (Gopal)", number: "+91 94432-11000", type: "outgoing", time: "08:15 AM", duration: "1m 10s", isSpam: false }
    ]
  },

  mother: {
    deviceName: "Mother's Samsung Galaxy A14",
    owner: "Sunita Sharma (Homemaker)",
    wallpaper: "bg-gradient-to-b from-amber-950 via-slate-900 to-amber-900/80",
    notifications: [
      {
        id: "notif_m1",
        app: "SMS",
        sender: "Mixer Service Center",
        title: "Warranty Replacement Approved",
        time: "5m ago",
        preview: "Pay ₹50 processing fee via sponsored link to claim new replacement mixer."
      }
    ],
    messages: [
      {
        id: "msg_m1",
        sender: "Mixer Customer Support",
        avatar: "⚡",
        phone: "+91 800-225-2525",
        timestamp: "11:15 AM",
        unread: true,
        preview: "Your mixer replacement is ready! Pay ₹50 processing fee to dispatch.",
        thread: [
          { sender: "them", text: "Dear Sunita Sharma, your Bajaj Mixer replacement ticket #WM-9481 is approved." },
          { sender: "them", text: "Due to high demand, please pay ₹50 shipping registration fee via this link within 3 hours or request will expire: http://bajaj-free-mixer-replace.click/pay" }
        ]
      },
      {
        id: "msg_m2",
        sender: "Family Group",
        avatar: "👨‍👩‍👧‍👦",
        phone: "SHARMA-FAMILY",
        timestamp: "10:50 AM",
        unread: true,
        preview: "Meena aunty invited everyone for Sunday dinner at 8 PM.",
        thread: [
          { sender: "them", text: "Meena Aunty: Everyone please come for dinner this Sunday at 8 PM!" },
          { sender: "them", text: "Rohan: Super! I will come after college class." }
        ]
      },
      {
        id: "msg_m3",
        sender: "Local Grocery Store",
        avatar: "🥦",
        phone: "+91 98410-54321",
        timestamp: "10:15 AM",
        unread: false,
        preview: "Your monthly ration & vegetables order of ₹2,150 has been delivered.",
        thread: [
          { sender: "them", text: "Sharma Kirana: Namaste Sunita ji, your monthly grocery order of ₹2,150 delivered to home." }
        ]
      },
      {
        id: "msg_m4",
        sender: "Reka (Neighbor)",
        avatar: "👩",
        phone: "+91 94432-88112",
        timestamp: "Yesterday",
        unread: false,
        preview: "Sunita ji, do you have extra sugar? Making payasam...",
        thread: [
          { sender: "them", text: "Hi Sunita ji! Making payasam for festival, do you have 1 cup sugar to spare?" },
          { sender: "me", text: "Yes Reka! Come over, I will give you." }
        ]
      },
      {
        id: "msg_m5",
        sender: "School PTA Group",
        avatar: "🏫",
        phone: "PTA-DEPT",
        timestamp: "Yesterday",
        unread: false,
        preview: "Annual Sports Day registration closes on Friday.",
        thread: [
          { sender: "them", text: "School Admin: Sports Day registration forms must be submitted by Friday 4 PM." }
        ]
      },
      {
        id: "msg_m6",
        sender: "Apartment Society Admin",
        avatar: "🏢",
        phone: "SOCIETY-ADMIN",
        timestamp: "2 days ago",
        unread: false,
        preview: "Water tank maintenance scheduled for tomorrow 9 AM - 12 PM.",
        thread: [
          { sender: "them", text: "Society Admin: Water tank cleaning tomorrow morning. Please store required water." }
        ]
      }
    ],
    gallery: [
      {
        id: "gal_m1",
        title: "Mixer Grinder Warranty Card",
        src: "/assets/warranty_card.png",
        date: "Purchased 2024",
        caption: "Mixer Grinder Warranty Card - Valid till 2027",
        isEvidence: true
      },
      {
        id: "gal_m2",
        title: "Original Purchase Receipt",
        src: "/assets/mixer_invoice.png",
        date: "Today 11:20 AM",
        caption: "Original Purchase Receipt from Authorized Dealer showing 3-Year Free Replacement Guarantee.",
        isEvidence: true
      }
    ],
    callLog: [
      { id: "call_m1", name: "Service Desk Rep", number: "+91 91234-99887", type: "incoming", time: "11:30 AM", duration: "4m 12s", isSpam: true },
      { id: "call_m2", name: "Service Center Toll-Free", number: "+91 800-225-2525", type: "outgoing", time: "11:15 AM", duration: "1m 05s", isSpam: false },
      { id: "call_m3", name: "Family Grocery Store", number: "+91 98410-54321", type: "outgoing", time: "09:40 AM", duration: "2m 20s", isSpam: false }
    ]
  },

  sibling: {
    deviceName: "Sibling's Samsung Galaxy F23",
    owner: "Rohan Sharma (College Student)",
    wallpaper: "bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950",
    notifications: [
      {
        id: "notif_s1",
        app: "Telegram",
        sender: "Elena HR (Daily Cash)",
        title: "₹5,000 Daily Student Income",
        time: "Just now",
        preview: "Earn ₹5,000 daily by rating videos! Install APK to receive payouts."
      }
    ],
    messages: [
      {
        id: "msg_s1",
        sender: "Telegram Job Alert (Elena HR)",
        avatar: "💸",
        phone: "+44 7911-123456",
        timestamp: "02:15 PM",
        unread: true,
        preview: "Earn ₹3,000 - ₹5,000 daily from your hostel room by rating YouTube videos!",
        thread: [
          { sender: "them", text: "Hey Student! Need part-time cash for college fees? Earn ₹50 per video rating!" },
          { sender: "them", text: "Download FastCash Pro APK from our Telegram channel to receive instant automated UPI payouts. Enable SMS & Contact permissions during installation." },
          { sender: "them", type: "image", src: "/comics/telegram_scam.png", caption: "Fake payment proofs posted in Telegram job channel." }
        ]
      },
      {
        id: "msg_s2",
        sender: "Hostel Boys Group",
        avatar: "🎓",
        phone: "HOSTEL-GRP",
        timestamp: "12:00 PM",
        unread: false,
        preview: "Warden notice regarding fee deadline!",
        thread: [
          { sender: "them", text: "Guys! Warden said mess fee ₹25,000 must be paid by Friday or fine ₹500/day." }
        ]
      }
    ],
    gallery: [
      {
        id: "gal_s1",
        title: "Hostel Dues Receipt",
        src: "/comics/case2_wallet.png",
        date: "Yesterday",
        caption: "Mess fee invoice for ₹25,000 triggering urgent search for quick income.",
        isEvidence: true
      },
      {
        id: "gal_s2",
        title: "Telegram Payment Screenshots",
        src: "/comics/telegram_scam.png",
        date: "Today 02:00 PM",
        caption: "Edited GPay payment proofs shared by Telegram scammers to hook students.",
        isEvidence: true
      }
    ],
    callLog: [
      { id: "call_s1", name: "Telegram Overseas Admin", number: "+44 7911-123456", type: "missed", time: "02:15 PM", duration: "0s", isSpam: true },
      { id: "call_s2", name: "Hostel Warden Office", number: "+91 94123-00000", type: "incoming", time: "01:00 PM", duration: "1m 30s", isSpam: false },
      { id: "call_s3", name: "College Friend (Amit)", number: "+91 98980-11223", type: "outgoing", time: "11:20 AM", duration: "5m 45s", isSpam: false }
    ]
  },

  protagonist_qr: {
    deviceName: "Protagonist's Samsung Galaxy S23",
    owner: "Aditya Sharma (Protagonist)",
    wallpaper: "bg-gradient-to-b from-slate-950 via-blue-950/80 to-slate-900",
    notifications: [
      {
        id: "notif_pq1",
        app: "OLX Chat",
        sender: "Capt. Rajesh (Army Merchant)",
        title: "Textbooks Buyer Payment",
        time: "2m ago",
        preview: "I am sending ₹4,500 via Army Merchant portal. Enter UPI PIN to collect."
      }
    ],
    messages: [
      {
        id: "msg_pq1",
        sender: "Capt. Rajesh Kumar (OLX Buyer)",
        avatar: "🪖",
        phone: "+91 99887-76655",
        timestamp: "04:10 PM",
        unread: true,
        preview: "I am purchasing all your engineering books. Scan QR and enter PIN to collect.",
        thread: [
          { sender: "them", text: "Jai Hind! I am Captain Rajesh Kumar posted at Army Cantt. I want to buy all your engineering textbooks for ₹4,500." },
          { sender: "them", text: "Since I use an Army Merchant Defence Account, payments are processed via dual-authorization QR. I generated a collection QR." },
          { sender: "them", text: "Scan this QR on PhonePe / GPay and enter your UPI PIN to accept ₹4,500 directly into your bank account." },
          { sender: "them", type: "image", src: "/comics/qr_code.png", caption: "FAKE ARMY MERCHANT QR CODE (DEBITS ₹4,500)" }
        ]
      }
    ],
    gallery: [
      {
        id: "gal_pq1",
        title: "OLX Book Listing Photos",
        src: "/comics/qr_code.png",
        date: "Today 03:30 PM",
        caption: "Textbook collection photo uploaded to OLX Marketplace.",
        isEvidence: true
      },
      {
        id: "gal_pq2",
        title: "Fake Army ID Card Sent by Buyer",
        src: "/comics/hunt_begins1.png",
        date: "Today 04:12 PM",
        caption: "Forged Military Canteen ID card used by scammer to impersonate army officer.",
        isEvidence: true
      }
    ],
    callLog: [
      { id: "call_pq1", name: "Capt. Rajesh (OLX Buyer)", number: "+91 99887-76655", type: "incoming", time: "04:10 PM", duration: "3m 40s", isSpam: true },
      { id: "call_pq2", name: "Capt. Rajesh (OLX Buyer)", number: "+91 99887-76655", type: "missed", time: "04:15 PM", duration: "0s", isSpam: true }
    ]
  },

  father_arrest: {
    deviceName: "Father's Phone (CBI Extortion)",
    owner: "Ramesh Sharma",
    wallpaper: "bg-gradient-to-b from-purple-950 via-slate-900 to-black",
    notifications: [
      {
        id: "notif_fa1",
        app: "WhatsApp Video",
        sender: "CBI Cyber Enforcement Desk",
        title: "DIGITAL ARREST WARRANT",
        time: "URGENT",
        preview: "Legal Notice: Your Aadhaar linked to ₹4.2 Cr hawala scam. Connect video call immediately."
      }
    ],
    messages: [
      {
        id: "msg_fa1",
        sender: "CBI Enforcement Inspector",
        avatar: "⚖️",
        phone: "+91 11-2436-1234",
        timestamp: "09:30 AM",
        unread: true,
        preview: "HIGH COURT ARREST WARRANT: Connect WhatsApp Video Interrogation now!",
        thread: [
          { sender: "them", text: "ATTENTION RAMESH SHARMA: Order of Federal High Court. Case #CBI-2026-881A." },
          { sender: "them", text: "Your SIM card #98765-43210 is linked to illegal money laundering and illegal SIM swap operations in Mumbai." },
          { sender: "them", text: "You are under DIGITAL ARREST. Do not disconnect your phone or leave your room. Connect to WhatsApp Video Call immediately to record sworn statement." },
          { sender: "them", type: "image", src: "/comics/father_arrest.png", caption: "FORGED CBI DIGITAL ARREST WARRANT LETTER" }
        ]
      }
    ],
    gallery: [
      {
        id: "gal_fa1",
        title: "CBI Warrant PDF Screenshot",
        src: "/comics/father_arrest.png",
        date: "Today 09:32 AM",
        caption: "Fake CBI warrant document sent over WhatsApp demanding ₹2,50,000 clearance fee.",
        isEvidence: true
      },
      {
        id: "gal_fa2",
        title: "Fake Police Interrogation Room",
        src: "/comics/father_stall.png",
        date: "Today 09:35 AM",
        caption: "Screenshot of scammer wearing police uniform in fake office background.",
        isEvidence: true
      }
    ],
    callLog: [
      { id: "call_fa1", name: "CBI Cyber Officer (Extortion)", number: "+91 11-2436-1234", type: "incoming", time: "09:30 AM", duration: "8m 50s", isSpam: true },
      { id: "call_fa2", name: "CBI Cyber Desk", number: "+91 11-2436-9999", type: "missed", time: "09:40 AM", duration: "0s", isSpam: true }
    ]
  },

  sibling_task: {
    deviceName: "Sibling's Phone (Job Task Scam)",
    owner: "Rohan Sharma",
    wallpaper: "bg-gradient-to-b from-cyan-950 via-slate-900 to-indigo-950",
    notifications: [
      {
        id: "notif_st1",
        app: "Telegram",
        sender: "Elena HR Lead",
        title: "VIP Task Earnings Unlocked",
        time: "10m ago",
        preview: "Deposit ₹3,500 security deposit to release your ₹18,500 wallet balance!"
      }
    ],
    messages: [
      {
        id: "msg_st1",
        sender: "Elena HR (Global Media Tasks)",
        avatar: "💼",
        phone: "+91 91555-01928",
        timestamp: "03:20 PM",
        unread: true,
        preview: "Complete 5 hotel reviews to unlock your ₹18,500 earnings wallet!",
        thread: [
          { sender: "them", text: "Great job Rohan! Your preliminary trial tasks #1-#3 completed successfully." },
          { sender: "them", text: "Your dashboard balance is now ₹18,500! To withdraw to your bank account, deposit ₹3,500 refundable liquidity tax to tier-2 account." },
          { sender: "them", type: "image", src: "/comics/telegram_scam.png", caption: "FAKE TASK WALLET DASHBOARD (FROZEN ₹18,500 BALANCE)" }
        ]
      }
    ],
    gallery: [
      {
        id: "gal_st1",
        title: "Frozen Wallet Balance Dashboard",
        src: "/comics/telegram_scam.png",
        date: "Today 03:25 PM",
        caption: "Fake task portal website displaying ₹18,500 balance locked behind deposit requirement.",
        isEvidence: true
      },
      {
        id: "gal_st2",
        title: "College Placement Advisory",
        src: "/comics/case2_wallet.png",
        date: "Yesterday",
        caption: "College Placement Cell notice warning students against work-from-home Telegram task scams.",
        isEvidence: true
      }
    ],
    callLog: [
      { id: "call_st1", name: "Elena HR Lead", number: "+91 91555-01928", type: "incoming", time: "03:20 PM", duration: "5m 10s", isSpam: true },
      { id: "call_st2", name: "Task Support Line", number: "+91 91555-01999", type: "missed", time: "03:45 PM", duration: "0s", isSpam: true }
    ]
  },

  mother_blackout: {
    deviceName: "Mother's Phone (Power Disconnect)",
    owner: "Sunita Sharma",
    wallpaper: "bg-gradient-to-b from-stone-950 via-amber-950/80 to-black",
    notifications: [
      {
        id: "notif_mb1",
        app: "SMS",
        sender: "State Electricity Discom",
        title: "URGENT: Power Cut at 9:30 PM",
        time: "CRITICAL",
        preview: "Your electricity connection #883910 will be cut off tonight due to pending ₹145 bill."
      }
    ],
    messages: [
      {
        id: "msg_mb1",
        sender: "Electricity Discom Officer",
        avatar: "🔌",
        phone: "+91 94440-12345",
        timestamp: "08:15 PM",
        unread: true,
        preview: "URGENT DISCONNECT NOTICE: Update bill details via APK or power cut at 9:30 PM!",
        thread: [
          { sender: "them", text: "DEAR CONSUMER: Your electricity connection #883910 will be disconnected tonight at 9:30 PM due to unpaid bill of ₹145." },
          { sender: "them", text: "Do not pay on Paytm. Download official Discom Bill Update APK to update meter serial: http://discom-power-update.apk" }
        ]
      }
    ],
    gallery: [
      {
        id: "gal_mb1",
        title: "Switchboard Glitch Photo",
        src: "/comics/switch_board.png",
        date: "Today 08:00 PM",
        caption: "Photo of apartment circuit board during sudden voltage drop.",
        isEvidence: true
      },
      {
        id: "gal_mb2",
        title: "Discom SMS Disconnect Warning",
        src: "/comics/case1_mixer.png",
        date: "Today 08:16 PM",
        caption: "Phishing SMS scaring homemakers into downloading malware APK before 9:30 PM deadline.",
        isEvidence: true
      }
    ],
    callLog: [
      { id: "call_mb1", name: "Power Discom Official", number: "+91 94440-12345", type: "incoming", time: "08:15 PM", duration: "3m 05s", isSpam: true },
      { id: "call_mb2", name: "Apartment President", number: "+91 98400-11223", type: "outgoing", time: "08:25 PM", duration: "1m 40s", isSpam: false }
    ]
  },

  protagonist: {
    deviceName: "Protagonist's Cyber Detective Device",
    owner: "Aditya Sharma (Cyber Investigator)",
    wallpaper: "bg-gradient-to-b from-slate-950 via-blue-950/80 to-slate-900",
    notifications: [
      {
        id: "notif_p1",
        app: "Cyber Alert",
        sender: "State Cyber Crime Cell",
        title: "Extortion Network Flagged",
        time: "1m ago",
        preview: "Central Cyber Cell detected active syndicate targeting your family accounts."
      }
    ],
    messages: [
      {
        id: "msg_p1",
        sender: "HDFC-ALERT",
        avatar: "🏦",
        phone: "HDFC-BANK",
        timestamp: "Just now",
        unread: true,
        isMalicious: true,
        preview: "ALERT: ₹49,999 debited from Account **4819 for FLIPKART. Click link to block transaction immediately!",
        thread: [
          { sender: "them", text: "ALERT: ₹49,999 debited from Account **4819 for online purchase at FLIPKART. If not done by you, click link to block transaction immediately: http://hdfc-security-refund.xyz/block" }
        ]
      },
      {
        id: "msg_p2",
        sender: "Swiggy",
        avatar: "🛵",
        phone: "SWIGGY",
        timestamp: "12m ago",
        unread: false,
        preview: "Your order from Salem Biryani is on the way! OTP: 4921.",
        thread: [
          { sender: "them", text: "Your order from Salem Biryani is on the way! Delivery partner Ramesh is assigned. OTP for delivery: 4921." }
        ]
      },
      {
        id: "msg_p3",
        sender: "Jio-Info",
        avatar: "📶",
        phone: "199",
        timestamp: "2h ago",
        unread: false,
        preview: "Your 5G data pack expires in 3 days. Recharge now.",
        thread: [
          { sender: "them", text: "Your 5G Unlimited Daily Data Pack expires in 3 days. Recharge now via MyJio app to continue seamless 5G speed." }
        ]
      },
      {
        id: "msg_p4",
        sender: "COLLEGE-ADMIN",
        avatar: "🏫",
        phone: "COLLEGE-DEPT",
        timestamp: "Yesterday",
        unread: false,
        preview: "Reminder: Semester fee payment portal closes tomorrow.",
        thread: [
          { sender: "them", text: "Reminder: Semester 6 examination fee payment portal closes tomorrow at 5:00 PM. Submit fee receipt to department office." }
        ]
      },
      {
        id: "msg_p5",
        sender: "Mummy",
        avatar: "👩‍👦",
        phone: "+91 98410-11223",
        timestamp: "Yesterday",
        unread: false,
        preview: "Call me when you are free.",
        thread: [
          { sender: "them", text: "Beta, did you have lunch? Call me when you are free after your classes." }
        ]
      }
    ],
    gallery: [
      {
        id: "gal_p1",
        title: "Cyber Investigation Dossier",
        src: "/comics/hunt_begins1.png",
        date: "Today 05:05 PM",
        caption: "Digital evidence graph linking scammers across all 8 family cases.",
        isEvidence: true
      },
      {
        id: "gal_p2",
        title: "Scammer Call Logs & IP Traces",
        src: "/comics/father_arrest.png",
        date: "Today 05:10 PM",
        caption: "Telecom carrier logs confirming spoofed numbers used by cyber syndicate.",
        isEvidence: true
      }
    ],
    callLog: [
      { id: "call_p1", name: "State Cyber Desk #1930", number: "1930", type: "incoming", time: "05:00 PM", duration: "6m 30s", isSpam: false },
      { id: "call_p2", name: "Central Bank Fraud Cell", number: "+91 1800-22-1930", type: "outgoing", time: "05:15 PM", duration: "2m 10s", isSpam: false }
    ]
  }
};
