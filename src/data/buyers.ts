export const buyers = [
    {
        id: 1,
        name: "ผู้ซื้อ A",
        contact: "080-123-4567",
        email: "buyerA@example.com",
        location: "กรุงเทพมหานคร",
        requests: [
            {
                id: 101,
                product: "ข้าว",
                quantity: 1000,
                status: "รอการตอบกลับ"
            },
            {
                id: 102,
                product: "ผัก",
                quantity: 500,
                status: "สำเร็จ"
            }
        ]
    },
    {
        id: 2,
        name: "ผู้ซื้อ B",
        contact: "081-234-5678",
        email: "buyerB@example.com",
        location: "เชียงใหม่",
        requests: [
            {
                id: 201,
                product: "ผลไม้",
                quantity: 300,
                status: "รอการตอบกลับ"
            }
        ]
    },
    {
        id: 3,
        name: "ผู้ซื้อ C",
        contact: "082-345-6789",
        email: "buyerC@example.com",
        location: "ภูเก็ต",
        requests: []
    }
];