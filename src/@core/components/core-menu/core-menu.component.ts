import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';
import { SecurityService } from 'app/services/security.service';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _coreMenuService: CoreMenuService,
    private _securityService: SecurityService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the menu either from the input or from the service
    this.menu = this.menu || this._coreMenuService.getCurrentMenu();

    // Subscribe to the current menu changes
    this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      this.currentUser = this._securityService.getCurrentUser();

      // Load menu
      this.menu = this._coreMenuService.getCurrentMenu();

      this.menu.forEach(element => {
       let valor =  element?.role.includes(this.currentUser?.role) 
       console.log(valor)
      });

      this._changeDetectorRef.markForCheck();
    });
  }
}
