import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }
  
  login(body:any){
    return this.http.post(`${this.apiUrl}/auth/login`,body
    ,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      })
    }
    );
  }

  loginGG(body:any){
    return this.http.post(`${this.apiUrl}/auth/loginGG`,body
    ,{
      observe:'body',
      withCredentials:true,
      headers:new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      })
    }
    );
  }
  // Gửi yêu cầu POST để tạo user mới
  postUser(user: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.post(`${this.apiUrl}/user`, user, httpOptions);
  }

  // Gửi yêu cầu GET để lấy tất cả users
  getAllUsers(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
     
  return this.http.get(`${this.apiUrl}/user`, httpOptions);
  }

  getUserById(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ this.gettoken()
      })
    };

    return this.http.get(`${this.apiUrl}/user/${this.getUserId()}`, httpOptions)
  }
  
 // Phương thức PUT để cập nhật thông tin của một người dùng
  updateUser(userId: number, user: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.put<any>(`${this.apiUrl}/user/${userId}`, user, httpOptions);
  }

  // Phương thức DELETE để xóa một người dùng
  deleteUser(userId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.delete<any>(`${this.apiUrl}/user/${userId}`, httpOptions);
  }

  gettoken()
  {
  return localStorage.getItem('token');
  }
  getpayload()
  {
    let token:any = this.gettoken();
    return JSON.parse(window.atob(token.split('.')[1])); 
  }
  getUserId(){
    return localStorage.getItem('currentemployeeid')
  }

  getAllClients(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
     
  return this.http.get(`${this.apiUrl}/client`, httpOptions);
  }

  postClient(client: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.post(`${this.apiUrl}/client`, client, httpOptions);
  }

  updateClient(clientId: number, client: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.patch<any>(`${this.apiUrl}/client/${clientId}`, client, httpOptions);
  }

  // Phương thức DELETE để xóa một người dùng
  deleteClient(clientId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.delete<any>(`${this.apiUrl}/client/${clientId}`, httpOptions);
  }

  getAllTasks(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
     
  return this.http.get(`${this.apiUrl}/task`, httpOptions);
  }

  getAllTasksCommon(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
     
  return this.http.get(`${this.apiUrl}/task/common`, httpOptions);
  }

  getAllTasksOther(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
     
  return this.http.get(`${this.apiUrl}/task/other`, httpOptions);
  
  }

  postTask(task: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.post(`${this.apiUrl}/task`, task, httpOptions);
  }
  updateTask(taskId: number, task: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.patch<any>(`${this.apiUrl}/task/${taskId}`, task, httpOptions);
  }

  // Phương thức DELETE để xóa một người dùng
  deleteTask(taskId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.delete<any>(`${this.apiUrl}/task/${taskId}`, httpOptions);
  }

  getAllProjects(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
     
  return this.http.get(`${this.apiUrl}/project`, httpOptions);
  }

  getProjectId(projectId: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
     
  return this.http.get(`${this.apiUrl}/project/${projectId}`, httpOptions);
  }

  getProjectByManager(userId: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
     
  return this.http.get(`${this.apiUrl}/project/projectByManager/${userId}`, httpOptions);
  }

  postProject(project: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.post(`${this.apiUrl}/project`, project, httpOptions);
  }

  updateProject(projectId: number, project: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.patch<any>(`${this.apiUrl}/project/${projectId}`, project, httpOptions);
  }

  // Phương thức DELETE để xóa một người dùng
  deleteProject(projectId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.delete<any>(`${this.apiUrl}/project/${projectId}`, httpOptions);
  }

  getAllTimesheets(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
     
  return this.http.get(`${this.apiUrl}/time-sheet`, httpOptions);
  }
  getTimesheetByUser(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
     
  return this.http.get(`${this.apiUrl}/time-sheet/user/${this.getUserId()}`, httpOptions);
  }

  getAllTimesheetPending(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    }
    return this.http.get(`${this.apiUrl}/time-sheet/pending`, httpOptions);
  }

  getTimesheetPendingByRole(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':  '*/*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    }
    return this.http.get(`${this.apiUrl}/time-sheet/manager/${this.getUserId()}`, httpOptions);
  }
  

  postTimesheet(timesheet: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type':'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.post(`${this.apiUrl}/time-sheet`, timesheet, httpOptions);
  }

  updateTimesheet(tiemsheetId: number, timesheet: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.patch<any>(`${this.apiUrl}/time-sheet/${tiemsheetId}`, timesheet, httpOptions);
  }

  
  deleteTimesheet(tiemsheetId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.delete<any>(`${this.apiUrl}/time-sheet/${tiemsheetId}`, httpOptions);
  }

  submitTimesheetWeek(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken(),
      })
    };
    return this.http.put<any>(`${this.apiUrl}/time-sheet/submit`,{}, httpOptions);
  }

  approvalTimesheet(timesheets:any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.put(`${this.apiUrl}/time-sheet/approval`,timesheets, httpOptions);
  }

  rejectTimesheetLastWeek(timesheets:any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
    return this.http.put(`${this.apiUrl}/time-sheet/reject`,timesheets, httpOptions);
  }

  logout()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('currentemployeeemail');
    localStorage.removeItem('currentemployeeid')
  }
}
