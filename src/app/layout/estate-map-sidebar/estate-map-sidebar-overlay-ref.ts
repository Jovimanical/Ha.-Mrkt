import { OverlayRef } from '@angular/cdk/overlay';
import { EstateMapSidebarComponent } from './estate-map-sidebar.component';
import { Subject, Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators';

export class EstateMapSidebarOverlayRef {
    private _beforeClose = new Subject<void>();
    private _afterClosed = new Subject<void>();
    public componentInstance: EstateMapSidebarComponent;

    constructor(private overlayRef: OverlayRef) { }
    
    public afterClosed(): Observable<void> {
        return this._afterClosed.asObservable();
    }

    public beforeClose(): Observable<void> {
        return this._beforeClose.asObservable();
    }

    public close(): void {
        // Listen for animation 'start' events
        this.componentInstance.animationStateChanged
            .pipe(filter(event => event.phaseName === 'start'), take(1))
            .subscribe(() => {
                this._beforeClose.next();
                this._beforeClose.complete();
                this.overlayRef.detachBackdrop();
            });

        // Listen for animation 'done' events
        this.componentInstance.animationStateChanged
            .pipe(filter(event => event.phaseName === 'done' && event.toState === 'leave'), take(1))
            .subscribe(() => {
                this.overlayRef.dispose();
                this._afterClosed.next();
                this._afterClosed.complete();
                // Make sure to also clear the reference to the
                // component instance to avoid memory leaks
                this.componentInstance = null;
            });

        // Start exit animation
        this.componentInstance.startExitAnimation();
    }
}
