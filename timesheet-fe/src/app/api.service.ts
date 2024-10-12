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

  logout()
  {
    localStorage.removeItem('token');
    localStorage.removeItem('currentemployeeemail');
    localStorage.removeItem('currentemployeeid')
  }

  gettoken() {
    return localStorage.getItem('token');
    }

  httpOptions() {
    return {
      headers: new HttpHeaders({
        'Accept': 'application/json, text/plain, */*',
         'Content-Type':'application/json',
         'Authorization': 'Bearer'+' '+ this.gettoken()
      })
    };
  }

  getpayload() {
    let token:any = this.gettoken();
    return JSON.parse(window.atob(token.split('.')[1])); 
  }

  getUserId(){
    return localStorage.getItem('currentemployeeid')
  }

  postUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, user, this.httpOptions());
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`, this.httpOptions());
  }

  getUserById(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${this.getUserId()}`, this.httpOptions())
  }
  
  updateUser(userId: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/${userId}`, user, this.httpOptions());
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/user/${userId}`, this.httpOptions());
  }

  getAllClients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/client`, this.httpOptions());
  }

  postClient(client: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/client`, client, this.httpOptions());
  }

  updateClient(clientId: number, client: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/client/${clientId}`, client, this.httpOptions());
  }

  deleteClient(clientId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/client/${clientId}`, this.httpOptions());
  }

  getAllTasks(): Observable<any> {  
    return this.http.get(`${this.apiUrl}/task`, this.httpOptions());
  }

  getAllTasksCommon(): Observable<any> { 
    return this.http.get(`${this.apiUrl}/task/common`, this.httpOptions());
  }

  getAllTasksOther(): Observable<any> {
    return this.http.get(`${this.apiUrl}/task/other`, this.httpOptions());
  }

  postTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/task`, task, this.httpOptions());
  }
  updateTask(taskId: number, task: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/task/${taskId}`, task, this.httpOptions());
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/task/${taskId}`, this.httpOptions());
  }

  getAllProjects(): Observable<any> { 
    return this.http.get(`${this.apiUrl}/project`, this.httpOptions());
  }

  getProjectId(projectId: any): Observable<any> { 
    return this.http.get(`${this.apiUrl}/project/${projectId}`, this.httpOptions());
  }

  getProjectByManager(userId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/project/projectByManager/${userId}`, this.httpOptions());
  }

  postProject(project: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/project`, project, this.httpOptions());
  }

  updateProject(projectId: number, project: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/project/${projectId}`, project, this.httpOptions());
  }

  deleteProject(projectId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/project/${projectId}`, this.httpOptions());
  }

  getAllTimesheets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/time-sheet`, this.httpOptions());
  }
  getTimesheetByUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/time-sheet/user/${this.getUserId()}`, this.httpOptions());
  }

  getAllTimesheetPending(): Observable<any> {
    return this.http.get(`${this.apiUrl}/time-sheet/pending`, this.httpOptions());
  }

  getTimesheetPendingByRole(): Observable<any> {
    return this.http.get(`${this.apiUrl}/time-sheet/manager/${this.getUserId()}`, this.httpOptions());
  }
  
  postTimesheet(timesheet: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/time-sheet`, timesheet, this.httpOptions());
  }

  updateTimesheet(tiemsheetId: number, timesheet: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/time-sheet/${tiemsheetId}`, timesheet, this.httpOptions());
  }

  deleteTimesheet(tiemsheetId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/time-sheet/${tiemsheetId}`, this.httpOptions());
  }

  submitTimesheetWeek(): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/time-sheet/submit`,{}, this.httpOptions());
  }

  approvalTimesheet(timesheets:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/time-sheet/approval`,timesheets, this.httpOptions());
  }

  rejectTimesheetLastWeek(timesheets:any): Observable<any> {
    return this.http.put(`${this.apiUrl}/time-sheet/reject`,timesheets, this.httpOptions());
  }

  postBranch(branch: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/branch`, branch, this.httpOptions());
  }

  getAllBranchs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/branch`, this.httpOptions());
  }

  getBranchById(branchID: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/branch/${branchID}`, this.httpOptions())
  }
  
  updateBranch(branchID: number, branch: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/branch/${branchID}`, branch, this.httpOptions());
  }

  deleteBranch(branchID: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/branch/${branchID}`, this.httpOptions());
  }

  postPosition(position: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/position`, position, this.httpOptions());
  }

  getAllPositions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/position`, this.httpOptions());
  }

  getPositionById(positionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/position/${positionId}`, this.httpOptions())
  }
  
  updatePosition(positionId: number, position: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/position/${positionId}`, position, this.httpOptions());
  }

  deletePosition(positionId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/position/${positionId}`, this.httpOptions());
  }
}
