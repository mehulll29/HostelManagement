class ComplaintSystem {
 static submitComplaint(complaintData) {
    const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
    const currentUser = AuthSystem.getCurrentUser();
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === currentUser.id);
    
    const complaint = {
        id: Date.now(),
        studentId: currentUser.id,
        studentName: currentUser.fullName,
        title: complaintData.title,
        category: complaintData.category,
        description: complaintData.description,
        priority: complaintData.priority,
        status: 'submitted',
        submittedDate: new Date().toISOString(),
        assignedTo: null,
        resolutionDate: null,
        // Include room information if available
        roomNumber: student ? student.roomAllocated : null
    };
    
    complaints.push(complaint);
    localStorage.setItem('complaints', JSON.stringify(complaints));
    return complaint;
}
    
    static getComplaintsByStudent(studentId) {
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
         return complaints.filter(comp => comp.studentId === studentId);
     }
    
     static updateComplaintStatus(complaintId, status, assignedTo = null) {
        const complaints = JSON.parse(localStorage.getItem('complaints')) || [];
        const complaint = complaints.find(comp => comp.id === complaintId);
        
        if (complaint) {
           complaint.status = status;
           if (assignedTo) complaint.assignedTo = assignedTo;
        if (status === 'resolved') complaint.resolutionDate = new Date().toISOString();
            
           localStorage.setItem('complaints', JSON.stringify(complaints));
          return complaint;
       }
        return null;
    }
}