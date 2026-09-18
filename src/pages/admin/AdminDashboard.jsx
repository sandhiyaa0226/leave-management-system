import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../api/axios';
import { formatDate, formatAppliedDate } from '../../utils/formatDate';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('departments');
  const [departments, setDepartments] = useState([]);
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [error, setError] = useState('');
  const [staff, setStaff] = useState([]);
const [showAddStaff, setShowAddStaff] = useState(false);
const [staffForm, setStaffForm] = useState({
  name: '', email: '', password: '', role: 'tutor', department_id: ''
});
const [students, setStudents] = useState([]);
const [showAddStudent, setShowAddStudent] = useState(false);
const [studentForm, setStudentForm] = useState({
  name: '', email: '', password: '', roll_number: '',
  department_id: '', tutor_id: '', hod_id: ''
});
const [allRequests, setAllRequests] = useState([]);
const [requestFilter, setRequestFilter] = useState('all');

const fetchAllRequests = async () => {
  try {
    const res = await api.get('/leave-requests/all');
    setAllRequests(res.data);
  } catch (err) {
    setError('Failed to load leave requests');
  }
};

useEffect(() => {
  fetchDepartments();
  fetchStaff();
  fetchStudents();
  fetchAllRequests();
}, []);

useEffect(() => {
  fetchDepartments();
  fetchStaff();
  fetchStudents();
}, []);

const fetchStudents = async () => {
  try {
    const res = await api.get('/students');
    setStudents(res.data);
  } catch (err) {
    setError('Failed to load students');
  }
};

const handleStudentChange = (e) => {
  setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
};

const handleAddStudent = async (e) => {
  e.preventDefault();
  setError('');
  try {
    await api.post('/students/register', studentForm);
    setStudentForm({ name: '', email: '', password: '', roll_number: '', department_id: '', tutor_id: '', hod_id: '' });
    setShowAddStudent(false);
    fetchStudents();
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to add student');
  }
};

// Filter tutors/HODs by the department selected in the form
const tutorsInDept = staff.filter(
  (u) => u.role === 'tutor' && String(u.department_id) === String(studentForm.department_id)
);
const hodsInDept = staff.filter(
  (u) => u.role === 'hod' && String(u.department_id) === String(studentForm.department_id)
);


  useEffect(() => {
  fetchDepartments();
  fetchStaff();
}, []);


const fetchStaff = async () => {
  try {
    const res = await api.get('/users');
    setStaff(res.data.filter((u) => ['tutor', 'hod', 'principal'].includes(u.role)));
  } catch (err) {
    setError('Failed to load staff');
  }
};

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (err) {
      setError('Failed to load departments');
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;
    try {
      await api.post('/departments', { name: newDeptName });
      setNewDeptName('');
      setShowAddDept(false);
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add department');
    }
  };

  const handleStaffChange = (e) => {
  setStaffForm({ ...staffForm, [e.target.name]: e.target.value });
};

const handleAddStaff = async (e) => {
  e.preventDefault();
  setError('');
  try {
    await api.post('/users/register', staffForm);
    setStaffForm({ name: '', email: '', password: '', role: 'tutor', department_id: '' });
    setShowAddStaff(false);
    fetchStaff();
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to add staff');
  }
 
};
  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'departments' && (
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Departments</h1>
              <p className="text-slate-500">Manage your college departments</p>
            </div>
            <button
              onClick={() => setShowAddDept(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-md"
            >
              + Add Department
            </button>
          </div>

          {/* Stat card */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-stone-200 rounded-lg p-5">
              <p className="text-xs text-slate-500 mb-1">Total Departments</p>
              <p className="text-3xl font-bold text-slate-800">{departments.length}</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left font-medium text-slate-500 px-5 py-3">Department Name</th>
                  <th className="text-left font-medium text-slate-500 px-5 py-3">Created On</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr key={dept.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-5 py-3.5 text-slate-800 font-medium">{dept.name}</td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(dept.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {departments.length === 0 && (
              <p className="text-center text-slate-400 py-8">No departments yet.</p>
            )}
          </div>
        </div>
      )}

     {activeTab === 'staff' && (
  <div>
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Staff</h1>
        <p className="text-slate-500">Manage tutors, HODs and principal</p>
      </div>
      <button
        onClick={() => setShowAddStaff(true)}
        className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-md"
      >
        + Add Staff
      </button>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-stone-200 rounded-lg p-5">
        <p className="text-xs text-slate-500 mb-1">Total Staff</p>
        <p className="text-3xl font-bold text-slate-800">{staff.length}</p>
      </div>
      <div className="bg-white border border-stone-200 rounded-lg p-5">
        <p className="text-xs text-slate-500 mb-1">Tutors</p>
        <p className="text-3xl font-bold text-slate-800">{staff.filter(s => s.role === 'tutor').length}</p>
      </div>
      <div className="bg-white border border-stone-200 rounded-lg p-5">
        <p className="text-xs text-slate-500 mb-1">HODs</p>
        <p className="text-3xl font-bold text-slate-800">{staff.filter(s => s.role === 'hod').length}</p>
      </div>
    </div>

    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Name</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Email</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id} className="border-b border-stone-100 last:border-0">
              <td className="px-5 py-3.5 text-slate-800 font-medium">{s.name}</td>
              <td className="px-5 py-3.5 text-slate-500">{s.email}</td>
              <td className="px-5 py-3.5">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 uppercase">
                  {s.role}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {staff.length === 0 && <p className="text-center text-slate-400 py-8">No staff yet.</p>}
    </div>
  </div>
)}
      {activeTab === 'students' && (
  <div>
    <div className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Students</h1>
        <p className="text-slate-500">Manage student records and assignments</p>
      </div>
      <button
        onClick={() => setShowAddStudent(true)}
        className="bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold px-5 py-2.5 rounded-md"
      >
        + Add Student
      </button>
    </div>

    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-stone-200 rounded-lg p-5">
        <p className="text-xs text-slate-500 mb-1">Total Students</p>
        <p className="text-3xl font-bold text-slate-800">{students.length}</p>
      </div>
    </div>

    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Name</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Roll No</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Department</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Tutor</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">HOD</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="border-b border-stone-100 last:border-0">
              <td className="px-5 py-3.5 text-slate-800 font-medium">{s.name}</td>
              <td className="px-5 py-3.5 text-slate-500">{s.roll_number || '—'}</td>
              <td className="px-5 py-3.5 text-slate-500">{s.department_name}</td>
              <td className="px-5 py-3.5 text-slate-500">{s.tutor_name}</td>
              <td className="px-5 py-3.5 text-slate-500">{s.hod_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && <p className="text-center text-slate-400 py-8">No students yet.</p>}
    </div>
  </div>
)}
     {activeTab === 'requests' && (
  <div>
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Leave Requests</h1>
      <p className="text-slate-500">All leave requests across the college</p>
    </div>

    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white border border-stone-200 rounded-lg p-5">
        <p className="text-xs text-slate-500 mb-1">Total</p>
        <p className="text-3xl font-bold text-slate-800">{allRequests.length}</p>
      </div>
      <div className="bg-white border border-stone-200 rounded-lg p-5">
        <p className="text-xs text-slate-500 mb-1">Pending</p>
        <p className="text-3xl font-bold text-amber-600">
          {allRequests.filter(r => r.final_status === 'pending').length}
        </p>
      </div>
      <div className="bg-white border border-stone-200 rounded-lg p-5">
        <p className="text-xs text-slate-500 mb-1">Approved</p>
        <p className="text-3xl font-bold text-emerald-600">
          {allRequests.filter(r => r.final_status === 'approved').length}
        </p>
      </div>
      <div className="bg-white border border-stone-200 rounded-lg p-5">
        <p className="text-xs text-slate-500 mb-1">Rejected</p>
        <p className="text-3xl font-bold text-red-600">
          {allRequests.filter(r => r.final_status === 'rejected').length}
        </p>
      </div>
    </div>

    <div className="flex gap-2 mb-4">
      {['all', 'pending', 'approved', 'rejected'].map((f) => (
        <button
          key={f}
          onClick={() => setRequestFilter(f)}
          className={`text-sm font-medium px-4 py-2 rounded-md capitalize transition-colors
            ${requestFilter === f
              ? 'bg-blue-900 text-white'
              : 'bg-white border border-stone-300 text-slate-600 hover:bg-stone-100'}`}
        >
          {f}
        </button>
      ))}
    </div>

    <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-stone-50 border-b border-stone-200">
          <tr>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Student</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Department</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Dates</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Applied</th>
            <th className="text-left font-medium text-slate-500 px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {allRequests
            .filter((r) => requestFilter === 'all' || r.final_status === requestFilter)
            .map((r) => (
              <tr key={r.id} className="border-b border-stone-100 last:border-0">
                <td className="px-5 py-3.5">
                  <p className="text-slate-800 font-medium">{r.student_name}</p>
                  <p className="text-slate-400 text-xs">{r.roll_number || 'No Roll No'}</p>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{r.department_name}</td>
                <td className="px-5 py-3.5 text-slate-500">
                  {formatDate(r.from_date)} → {formatDate(r.to_date)}
                  <span className="text-slate-400"> ({r.number_of_days}d)</span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{formatAppliedDate(r.created_at)}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize
                    ${r.final_status === 'approved' ? 'bg-emerald-50 text-emerald-700' : ''}
                    ${r.final_status === 'pending' ? 'bg-amber-50 text-amber-700' : ''}
                    ${r.final_status === 'rejected' ? 'bg-red-50 text-red-700' : ''}
                  `}>
                    {r.final_status}
                  </span>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
      {allRequests.length === 0 && <p className="text-center text-slate-400 py-8">No leave requests yet.</p>}
    </div>
  </div>
)}

      {/* Add Department Modal */}
      {showAddDept && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Department</h3>
            <form onSubmit={handleAddDepartment}>
              <input
                type="text"
                placeholder="Department name"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                autoFocus
                className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm mb-4
                           focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
              />
              {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDept(false)}
                  className="px-4 py-2 text-sm rounded-md border border-stone-300 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-md bg-blue-900 hover:bg-blue-800 text-white font-medium"
                >
                  Add Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showAddStaff && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Add Staff Member</h3>
      <form onSubmit={handleAddStaff} className="space-y-3">
        <input
          type="text" name="name" placeholder="Full Name"
          value={staffForm.name} onChange={handleStaffChange} required
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        />
        <input
          type="email" name="email" placeholder="Email"
          value={staffForm.email} onChange={handleStaffChange} required
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        />
        <input
          type="password" name="password" placeholder="Password"
          value={staffForm.password} onChange={handleStaffChange} required
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        />
        <select
          name="role" value={staffForm.role} onChange={handleStaffChange}
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        >
          <option value="tutor">Tutor</option>
          <option value="hod">HOD</option>
          <option value="principal">Principal</option>
        </select>
        <select
          name="department_id" value={staffForm.department_id} onChange={handleStaffChange}
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => setShowAddStaff(false)}
            className="px-4 py-2 text-sm rounded-md border border-stone-300 hover:bg-stone-50">
            Cancel
          </button>
          <button type="submit"
            className="px-4 py-2 text-sm rounded-md bg-blue-900 hover:bg-blue-800 text-white font-medium">
            Add Staff
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{showAddStudent && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
      <h3 className="text-lg font-bold text-slate-800 mb-4">Add Student</h3>
      <form onSubmit={handleAddStudent} className="space-y-3">
        <input
          type="text" name="name" placeholder="Full Name"
          value={studentForm.name} onChange={handleStudentChange} required
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        />
        <input
          type="email" name="email" placeholder="Email"
          value={studentForm.email} onChange={handleStudentChange} required
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        />
        <input
          type="password" name="password" placeholder="Password"
          value={studentForm.password} onChange={handleStudentChange} required
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        />
        <input
          type="text" name="roll_number" placeholder="Roll Number"
          value={studentForm.roll_number} onChange={handleStudentChange}
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        />
        <select
          name="department_id" value={studentForm.department_id} onChange={handleStudentChange} required
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
        <select
          name="tutor_id" value={studentForm.tutor_id} onChange={handleStudentChange} required
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        >
          <option value="">-- Select Tutor --</option>
          {tutorsInDept.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <select
          name="hod_id" value={studentForm.hod_id} onChange={handleStudentChange} required
          className="w-full px-3 py-2.5 border border-stone-300 rounded-md text-sm"
        >
          <option value="">-- Select HOD --</option>
          {hodsInDept.map((h) => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => setShowAddStudent(false)}
            className="px-4 py-2 text-sm rounded-md border border-stone-300 hover:bg-stone-50">
            Cancel
          </button>
          <button type="submit"
            className="px-4 py-2 text-sm rounded-md bg-blue-900 hover:bg-blue-800 text-white font-medium">
            Add Student
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </AdminLayout>
  );
}

export default AdminDashboard;