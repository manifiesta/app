import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BaseService } from "../base.service";
import { LanguageCommunicationService } from "../../communication/language.communication.service";
import { LocalStorageEnum } from "src/app/shared/models/LocalStorage.enum";
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import { VolunteerShiftService } from "../volunteer-shift/volunteer-shift.service";

@Injectable({
  providedIn: 'root'
})
export class SellingService {

  baseUrl = `${environment.apiUrl}`;

  departmentsCache = [];

  constructor(
    private baseService: BaseService,
    private languageService: LanguageCommunicationService,
    private volunteerShiftService: VolunteerShiftService,
  ) {
  }

  getAllDepartments(): Observable<any[]> {
    return this.baseService.getCall(`${this.baseUrl}departments/${this.languageService.selectedLanguage}`).pipe(
      map(d => {
        return d.sort((a, b) => {
        });
      }),
      tap(d => { this.departmentsCache = d })
    );
  }

  getAllProvinceInfo(): Observable<any[]> {
    return this.baseService.getCall(`${this.baseUrl}departments/info/province`);
  }

  getAllTicketTypes(): Observable<any[]> {
    let shop = localStorage.getItem(LocalStorageEnum.SellerDepartment) || 'app';
    return this.baseService.getCall(`${this.baseUrl}tickets/types/${shop.toLowerCase()}`);
  }

  connectSeller(body): Observable<any> {
    return this.baseService.postCall(`${this.baseUrl}sellers/connect`, body);
  }

  // TODO check later to have more information
  verifySellerConnection(): Observable<any> {
    const sellerId = localStorage.getItem(LocalStorageEnum.BeepleId);
    if (sellerId && this.volunteerShiftService.isReadyToSellWithData()) {
      return of({ id: localStorage.getItem(LocalStorageEnum.BeepleId), sellTickets: 2, sellTicketsGoal: 10 });
    } else {
      return of(null);
    }
  }

  ticketsPrepar(
    tickets: any[],
    email: string,
    firstname: string,
    lastname: string,
    clientTransactionId: string,
  ): Observable<any> {
    return this.baseService.postCall(
      `${this.baseUrl}tickets/prepar`,
      {
        firstname,
        lastname,
        email,
        language: this.languageService.selectedLanguage,
        ip: "127.0.0.1",
        agent: "ManifiestApp",
        invoice: 0,
        testmode: 0,
        sellerId: localStorage.getItem(LocalStorageEnum.SellerEmail),
        sellerName: localStorage.getItem(LocalStorageEnum.SellerName),
        tickets,
        sellerDepartmentId: localStorage.getItem(LocalStorageEnum.SellerDepartment),
        sellerPostalCode: localStorage.getItem(LocalStorageEnum.SellerPostalCode),
        clientTransactionId,
        fromWorkGroup: localStorage.getItem(LocalStorageEnum.SellerFromWorkGroup) ? true : false,
        edition: '2024',
      }
    )
  }

  ticketsSale(
    transactionId: string,
  ): Observable<any> {
    return this.baseService.getCall(
      `${this.baseUrl}tickets/finishOrderPending/${transactionId}`,
    )
  }

  newsletterAdd(email: string, firstname: string, lastname: string): Observable<any> {
    return this.baseService.postCall(
      `${this.baseUrl}tickets/newsletter-add`,
      {
        firstname,
        lastname,
        email,
        'MMERGE6': this.languageService.selectedLanguage
      }
    )
  }

  getMySellingInformation(): Observable<any> {
    return this.baseService.getCall(
      `${this.baseUrl}tickets/sellingInformation/seller/${localStorage.getItem(LocalStorageEnum.SellerEmail)}/2024`
    );
  }

  getMyCurrentDepartmentSellingInformation(): Observable<any> {
    return this.baseService.getCall(
      `${this.baseUrl}tickets/sellingInformation/department/top-ten/${localStorage.getItem(LocalStorageEnum.SellerDepartment)}/${localStorage.getItem(LocalStorageEnum.SellerPostalCode)}/2024`
    );
  }

  getAllSellingInformation(): Observable<any> {
    return this.baseService.getCall(
      `${this.baseUrl}tickets/sellingInformation/seller/top-ten/2024`
    );
  }

  getMyCurrentPostCodeSellingInformation(): Observable<any> {
    const postCode = localStorage.getItem(LocalStorageEnum.SellerPostalCode);
    const sellerDepartement = localStorage.getItem(LocalStorageEnum.SellerDepartment);
    const fromWorkGroup = localStorage.getItem(LocalStorageEnum.SellerFromWorkGroup);
    return this.baseService.getCall(
      `${this.baseUrl}tickets/sellingInformation/postCode/${postCode}/${sellerDepartement}/${fromWorkGroup}/2024`
    );
  }

  getSellerQrCode(paymentOrder: any, forApp = false): Observable<any> {
    return this.baseService.postCall(
      `${this.baseUrl}tickets/seller/qrcode${forApp ? '/app' : ''}`,
      paymentOrder
    );
  }

}