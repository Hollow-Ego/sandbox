import { AfterViewChecked, Component, computed, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHostComponent } from '../controls/content-host.component';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormService } from '../../dynamic-form.service';
import { shouldBeShown } from '../../helper';
import { NestedDynamicFormGroup } from '../../dynamic-form.type';

@Component({
  selector: 'sbf-nested-dynamic-form-group',
  standalone: true,
  imports: [CommonModule, ContentHostComponent, ReactiveFormsModule],
  templateUrl: './nested-dynamic-form-group.component.html',
  styleUrl: './nested-dynamic-form-group.component.scss'
})
export class NestedDynamicFormGroupComponent implements OnInit, AfterViewChecked {
  @Input({ required: true }) group!: NestedDynamicFormGroup;

  private parentContainer = inject(ControlContainer);
  private dynamicFormService = inject(DynamicFormService);

  public isVisible = computed(() => {
    const value = this.dynamicFormService.formValue();
    if (!this.group.showIf || value === null) {
      return this.group.visible === undefined || this.group.visible;
    }
    return shouldBeShown(this.group.showIf, value);
  });

  get parentFormGroup() {
    return this.parentContainer.control as FormGroup;
  }

  ngOnInit(): void {
    this.parentFormGroup.addControl(this.group.id, new FormGroup({}));
  }

  ngAfterViewChecked() {
    this.parentFormGroup.updateValueAndValidity({ emitEvent: true });
  }
}