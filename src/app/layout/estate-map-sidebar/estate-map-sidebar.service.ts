import { Injectable, Injector, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector, PortalHost } from '@angular/cdk/portal';
import { EstateMapSidebarOverlayRef } from './estate-map-sidebar-overlay-ref';
import { EstateMapSidebarComponent } from './estate-map-sidebar.component';

interface EstateMapSidebarConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
}

const DEFAULT_CONFIG: EstateMapSidebarConfig = {
  hasBackdrop: true,
  backdropClass: 'sidebar-backdrop',
  panelClass: 'sidebar-panel',
};

@Injectable()
export class EstateMapSidebarService {

  constructor(
    private injector: Injector,
    private overlay: Overlay,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  open(component: any) {
    // Override default configuration
    const sidebarConfig = DEFAULT_CONFIG;
    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(sidebarConfig);
    // Instantiate remote control
    const sidebarRef = new EstateMapSidebarOverlayRef(overlayRef);
    const overlayComponent = this.attachSidebarContainer(
      EstateMapSidebarComponent,
      overlayRef,
      sidebarConfig,
      sidebarRef
    );

    // Pass the instance of the overlay component to the remote control
    sidebarRef.componentInstance = overlayComponent;
    overlayRef.backdropClick().subscribe(() => sidebarRef.close());
    return overlayRef;
  }

  private createOverlay(config: EstateMapSidebarConfig) {
    // const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(config);
  }

  private attachSidebarContainer(
    component:any,
    overlayRef: OverlayRef,
    config: EstateMapSidebarConfig,
    sidebarRef: EstateMapSidebarOverlayRef
  ) {
    const injector = this.createInjector(config, sidebarRef);
    const containerPortal = new ComponentPortal(component, null, injector);
    const containerRef: ComponentRef<any> = overlayRef.attach(containerPortal);
    return containerRef.instance;
  }

  private createInjector(config: EstateMapSidebarConfig, sidebarRef: EstateMapSidebarOverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(EstateMapSidebarOverlayRef, sidebarRef);
    return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: EstateMapSidebarConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    const overlayConfig = new OverlayConfig({
      positionStrategy,
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
    });

    return overlayConfig;
  }
}