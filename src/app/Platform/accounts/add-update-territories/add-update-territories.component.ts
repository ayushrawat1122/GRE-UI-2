import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../Services/account.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionUtil } from '../../../Core/common/CommonMethods/encryptdecrypt';

@Component({
  selector: 'app-add-update-territories',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-update-territories.component.html',
  styleUrl: './add-update-territories.component.css'
})
export class AddUpdateTerritoriesComponent {
  territoryForm!: FormGroup;
  private accountService = inject(AccountService);
  private toastrService = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  weekdays = [
    { label: 'Monday', control: 'monday' },
    { label: 'Tuesday', control: 'tuesday' },
    { label: 'Wednesday', control: 'wednesday' },
    { label: 'Thursday', control: 'thursday' },
    { label: 'Friday', control: 'friday' },
    { label: 'Saturday', control: 'saturday' },
    { label: 'Sunday', control: 'sunday' }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.territoryForm = this.fb.group({
      territoryId: [0], // hidden, for update
      territoryName: ['', Validators.required],
      monday: [false],
      tuesday: [false],
      wednesday: [false],
      thursday: [false],
      friday: [false],
      saturday: [false],
      sunday: [false]
    });

    this.route.paramMap.subscribe(params => {
      const id = EncryptionUtil.decrypt(params.get('id')!);
      if (id) {
        // this.userId = +id;
        this.loadTerritory(id); // fetch user and patch form
      }
    });
  }

  loadTerritory(id: any) {
    this.accountService.getTerritoryById(id).subscribe((response: any) => {
      if (response.statusCode === 200 && response.data) {
        const territory = response.data;
        this.territoryForm.patchValue({
          territoryId: territory.territoryId,
          territoryName: territory.territoryName,
          monday: territory.monday,
          tuesday: territory.tuesday,
          wednesday: territory.wednesday,
          thursday: territory.thursday,
          friday: territory.friday,
          saturday: territory.saturday,
          sunday: territory.sunday,
          isActive: territory.isActive
        });
      } else {
        this.toastrService.error(response.message || 'Territory not found.');
      }
    });
  }

  onSaveTerritory(): void {
    if (this.territoryForm.valid) {

      const territory = this.territoryForm.value;
      if (territory.territoryId > 0) {
        this.accountService.updateTerritory(this.territoryForm.value).subscribe((res: any) => {
          if (res && res.statusCode === 200) {
            this.toastrService.success(res.message);
            this.router.navigate(['/dashboard/account/territories']);
          } else {
            alert('Error updating territory: ' + res.message);
          }
        })
      }
      else {

        this.accountService.createTerritory(this.territoryForm.value).subscribe((res: any) => {
          if (res && res.statusCode === 200) {
            this.router.navigate(['/dashboard/account/territories']);

            this.toastrService.success(res.message);
            this.territoryForm.reset();
          } else {
            alert('Error creating territory: ' + res.message);
          }
        })
      }
    }
    else {
      this.territoryForm.markAllAsTouched();
    }
  }



}
