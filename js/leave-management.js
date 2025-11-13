// js/leave-management.js
class LeaveSystem {
    static applyForLeave(leaveData) {
        const leaves = JSON.parse(localStorage.getItem('leaves')) || [];
        const currentUser = AuthSystem.getCurrentUser();
        
        const leave = {
            id: Date.now(),
            studentId: currentUser.id,
            studentName: currentUser.fullName,
            fromDate: leaveData.fromDate,
            toDate: leaveData.toDate,
            destination: leaveData.destination,
            reason: leaveData.reason,
            parentContact: leaveData.parentContact,
            status: 'pending',
            appliedDate: new Date().toISOString(),
            approvedBy: null,
            gatePass: null
        };
        
        leaves.push(leave);
        localStorage.setItem('leaves', JSON.stringify(leaves));
        return leave;
    }
    
    static approveLeave(leaveId, wardenId) {
        const leaves = JSON.parse(localStorage.getItem('leaves')) || [];
        const leave = leaves.find(l => l.id === leaveId);
        
        if (leave) {
            leave.status = 'approved';
            leave.approvedBy = wardenId;
            leave.gatePass = `GP${Date.now()}`;
            
            localStorage.setItem('leaves', JSON.stringify(leaves));
            return leave;
        }
        return null;
    }
}