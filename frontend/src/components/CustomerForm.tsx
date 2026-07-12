"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/api";
import { User, Mail, Phone, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

// Zod schema for customer validation
const customerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone is required"),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface Props {
  initialData?: CustomerFormData & { id?: number };
  isEdit?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomerForm({ initialData, isEdit = false, onClose, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      if (isEdit && initialData?.id) {
        await apiRequest(`/customers/${initialData.id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });
        toast.success("Customer updated successfully!");
      } else {
        await apiRequest("/customers", {
          method: "POST",
          body: JSON.stringify(data),
        });
        toast.success("Customer added successfully!");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {isEdit ? "Edit Customer" : "Add New Customer"}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className={`input-field pl-11 ${errors.name ? "input-field-error" : ""}`}
              placeholder="John Doe"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              className={`input-field pl-11 ${errors.email ? "input-field-error" : ""}`}
              placeholder="john@example.com"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className={`input-field pl-11 ${errors.phone ? "input-field-error" : ""}`}
              placeholder="+1 (555) 000-0000"
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              isEdit ? "Update Customer" : "Add Customer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
