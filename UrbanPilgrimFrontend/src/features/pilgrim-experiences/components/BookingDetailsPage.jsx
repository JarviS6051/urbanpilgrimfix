import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getBookingDetails } from '../../../api/userApi';
console.log('getBookingDetails function imported:', typeof getBookingDetails);
import { getTokenFromCookie } from '../../../utils/cookies';
import { BASE_URL } from '../../../utils/constants';
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon as ClockIconSolid,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const BookingDetailsPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage or cookies
      let authToken = token;
      if (!authToken) {
        authToken = localStorage.getItem('token');
      }
      if (!authToken) {
        authToken = getTokenFromCookie();
      }

      if (!authToken) {
        console.log('No auth token found, redirecting to login');
        navigate('/login');
        return;
      }

      console.log('Auth token found, making API call...');
      console.log('Token length:', authToken?.length);
      console.log('Token preview:', authToken?.substring(0, 20) + '...');
      
      // Test if API is reachable
      try {
        const healthCheck = await fetch(`${BASE_URL.replace('/api', '')}/api/health`);
        console.log('Health check status:', healthCheck.status);
        if (healthCheck.ok) {
          const healthData = await healthCheck.json();
          console.log('Health check response:', healthData);
        }
      } catch (healthError) {
        console.error('Health check failed:', healthError);
      }
      
      // Test getting user bookings first to see if authentication works
      try {
        const { getUserBookings } = await import('../../../api/userApi');
        const bookingsResponse = await getUserBookings(authToken, 1, 5);
        console.log('User bookings response:', bookingsResponse);
        if (bookingsResponse.success && bookingsResponse.data.bookings.length > 0) {
          console.log('Available booking IDs:', bookingsResponse.data.bookings.map(b => b.bookingId));
        }
      } catch (bookingsError) {
        console.error('Error fetching user bookings:', bookingsError);
      }
      
      console.log('About to call getBookingDetails with:', { authToken: authToken ? 'Present' : 'Missing', bookingId });
      
      let response;
      try {
        console.log('getBookingDetails function type:', typeof getBookingDetails);
        console.log('getBookingDetails function:', getBookingDetails);
        
        // Test if the function is callable
        if (typeof getBookingDetails !== 'function') {
          throw new Error('getBookingDetails is not a function');
        }
        
        response = await getBookingDetails(authToken, bookingId);
        console.log('Booking details response:', response);
      } catch (apiError) {
        console.error('Error in getBookingDetails call:', apiError);
        console.error('Error stack:', apiError.stack);
        throw apiError;
      }
      
      if (response && response.success) {
        setBooking(response.data);
      } else {
        setError(response?.message || 'Failed to fetch booking details');
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError(err.message || 'Failed to fetch booking details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'payment_pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'payment_failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'expired':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'payment_pending':
        return 'Payment Pending';
      case 'payment_failed':
        return 'Payment Failed';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      case 'draft':
        return 'Draft';
      case 'in_progress':
        return 'In Progress';
      case 'refunded':
        return 'Refunded';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'payment_pending':
        return <ClockIconSolid className="w-5 h-5" />;
      case 'payment_failed':
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
      case 'in_progress':
        return <ClockIcon className="w-5 h-5" />;
      default:
        return <InformationCircleIcon className="w-5 h-5" />;
    }
  };

  const getBookingTypeIcon = (bookingType) => {
    if (bookingType === 'pilgrim_experience') {
      return (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
  };

  const getBookingDisplayDetails = () => {
    if (!booking) return null;

    if (booking.bookingType === 'pilgrim_experience') {
      const entity = booking.entity?.entityId;
      
      const title = entity?.name || 'Pilgrim Experience';
      
      let imageUrl = null;
      if (entity?.images && Array.isArray(entity.images) && entity.images.length > 0) {
        const firstImage = entity.images[0];
        if (typeof firstImage === 'object' && firstImage?.url) {
          imageUrl = firstImage.url;
        } else if (typeof firstImage === 'string') {
          imageUrl = firstImage;
        }
      }

      return {
        title,
        subtitle: `${booking.experienceDetails?.occupancyType === 'Couple' ? 'Twin' : booking.experienceDetails?.occupancyType || 'Single'} • ${booking.experienceDetails?.sessionCount || 0} session${(booking.experienceDetails?.sessionCount || 0) > 1 ? 's' : ''}`,
        dateInfo: booking.experienceDetails?.selectedDates ? 
          `${formatDate(booking.experienceDetails.selectedDates.from)} - ${formatDate(booking.experienceDetails.selectedDates.to)}` : 
          'Date not available',
        image: imageUrl,
        location: entity?.location || 'Location not specified'
      };
    } else {
      const entity = booking.entity?.entityId;
      
      const title = entity?.title || entity?.name || 'Wellness Class';
      
      let imageUrl = null;
      if (entity?.photos && Array.isArray(entity.photos) && entity.photos.length > 0) {
        const firstPhoto = entity.photos[0];
        if (typeof firstPhoto === 'object' && firstPhoto?.url) {
          imageUrl = firstPhoto.url;
        } else if (typeof firstPhoto === 'string') {
          imageUrl = firstPhoto;
        }
      }

      const firstSlot = booking.classDetails?.selectedSlots?.[0];
      return {
        title,
        subtitle: `${booking.classDetails?.attendeeCount || 0} attendee${(booking.classDetails?.attendeeCount || 0) > 1 ? 's' : ''} • ${booking.classDetails?.classCount || 0} class${(booking.classDetails?.classCount || 0) > 1 ? 'es' : ''}`,
        dateInfo: firstSlot ? 
          `${formatDate(firstSlot.date)} at ${formatTime(firstSlot.startTime)}` : 
          'Date not available',
        image: imageUrl,
        location: entity?.location || 'Location not specified'
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircleIcon className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Booking</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/my-bookings')}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Back to My Bookings
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <InformationCircleIcon className="w-8 h-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Booking Not Found</h3>
          <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => navigate('/my-bookings')}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  const bookingDetails = getBookingDisplayDetails();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate('/my-bookings')}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">Booking Details</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Booking ID: {booking.bookingId}</p>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                <span className="ml-1 sm:ml-2 hidden sm:inline">{getStatusText(booking.status)}</span>
                <span className="ml-1 sm:hidden">{getStatusText(booking.status).charAt(0)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Booking Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Image */}
                  <div className="flex-shrink-0 self-center sm:self-start">
                    {bookingDetails.image ? (
                      <img
                        src={bookingDetails.image}
                        alt={bookingDetails.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg flex items-center justify-center"
                      style={{display: bookingDetails.image ? 'none' : 'flex'}}
                    >
                      {getBookingTypeIcon(booking.bookingType)}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                      <div className="flex justify-center sm:justify-start">
                        {getBookingTypeIcon(booking.bookingType)}
                      </div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {bookingDetails.title}
                      </h2>
                    </div>
                    
                    <p className="text-gray-600 mb-3 text-sm sm:text-base">
                      {bookingDetails.subtitle}
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4" />
                        <span className="text-center sm:text-left">{bookingDetails.dateInfo}</span>
                      </div>
                      
                      <div className="flex items-center justify-center sm:justify-start space-x-2 text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="text-center sm:text-left">{bookingDetails.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Booking Information</h4>
                                         <div className="space-y-3">
                       <div className="flex flex-col sm:flex-row sm:justify-between">
                         <span className="text-gray-600 text-sm sm:text-base">Booking ID:</span>
                         <span className="font-medium text-gray-900 text-sm sm:text-base break-all">{booking.bookingId}</span>
                       </div>
                       <div className="flex flex-col sm:flex-row sm:justify-between">
                         <span className="text-gray-600 text-sm sm:text-base">Booking Type:</span>
                         <span className="font-medium text-gray-900 capitalize text-sm sm:text-base">
                           {booking.bookingType === 'pilgrim_experience' ? 'Pilgrim Experience' : 'Wellness Class'}
                         </span>
                       </div>
                       <div className="flex flex-col sm:flex-row sm:justify-between">
                         <span className="text-gray-600 text-sm sm:text-base">Booked On:</span>
                         <span className="font-medium text-gray-900 text-sm sm:text-base">{formatDate(booking.createdAt)}</span>
                       </div>
                       <div className="flex flex-col sm:flex-row sm:justify-between">
                         <span className="text-gray-600 text-sm sm:text-base">Status:</span>
                         <span className={`font-medium text-sm sm:text-base ${getStatusColor(booking.status).replace('bg-', 'text-').replace(' border-', '')}`}>
                           {getStatusText(booking.status)}
                         </span>
                       </div>
                     </div>
                  </div>

                                     <div>
                     <h4 className="font-medium text-gray-900 mb-3">Pricing</h4>
                     <div className="space-y-3">
                       <div className="flex flex-col sm:flex-row sm:justify-between">
                         <span className="text-gray-600 text-sm sm:text-base">Total Amount:</span>
                         <span className="font-bold text-base sm:text-lg text-gray-900">
                           ₹{booking.pricing?.totalAmount?.toLocaleString() || '0'}
                         </span>
                       </div>
                       {booking.pricing?.discountAmount > 0 && (
                         <div className="flex flex-col sm:flex-row sm:justify-between">
                           <span className="text-gray-600 text-sm sm:text-base">Discount:</span>
                           <span className="font-medium text-green-600 text-sm sm:text-base">
                             -₹{booking.pricing.discountAmount.toLocaleString()}
                           </span>
                         </div>
                       )}
                       {booking.pricing?.taxAmount > 0 && (
                         <div className="flex flex-col sm:flex-row sm:justify-between">
                           <span className="text-gray-600 text-sm sm:text-base">Tax:</span>
                           <span className="font-medium text-gray-900 text-sm sm:text-base">
                             ₹{booking.pricing.taxAmount.toLocaleString()}
                           </span>
                         </div>
                       )}
                     </div>
                   </div>
                </div>
              </div>
            </div>

                         {/* Specific Details */}
             {booking.bookingType === 'pilgrim_experience' && booking.experienceDetails && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                 <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                   <h3 className="text-lg font-semibold text-gray-900">Experience Details</h3>
                 </div>
                 <div className="p-4 sm:p-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                         <div>
                       <h4 className="font-medium text-gray-900 mb-3">Experience Information</h4>
                       <div className="space-y-3">
                         <div className="flex flex-col sm:flex-row sm:justify-between">
                           <span className="text-gray-600 text-sm sm:text-base">Occupancy Type:</span>
                           <span className="font-medium text-gray-900 text-sm sm:text-base">{booking.experienceDetails.occupancyType}</span>
                         </div>
                         <div className="flex flex-col sm:flex-row sm:justify-between">
                           <span className="text-gray-600 text-sm sm:text-base">Session Count:</span>
                           <span className="font-medium text-gray-900 text-sm sm:text-base">{booking.experienceDetails.sessionCount}</span>
                         </div>
                         <div className="flex flex-col sm:flex-row sm:justify-between">
                           <span className="text-gray-600 text-sm sm:text-base">Total Guests:</span>
                           <span className="font-medium text-gray-900 text-sm sm:text-base">{booking.experienceDetails.totalGuestCount}</span>
                         </div>
                       </div>
                     </div>

                                         <div>
                       <h4 className="font-medium text-gray-900 mb-3">Date Information</h4>
                       <div className="space-y-3">
                         <div className="flex flex-col sm:flex-row sm:justify-between">
                           <span className="text-gray-600 text-sm sm:text-base">From:</span>
                           <span className="font-medium text-gray-900 text-sm sm:text-base">
                             {booking.experienceDetails.selectedDates?.from ? formatDate(booking.experienceDetails.selectedDates.from) : 'Not specified'}
                           </span>
                         </div>
                         <div className="flex flex-col sm:flex-row sm:justify-between">
                           <span className="text-gray-600 text-sm sm:text-base">To:</span>
                           <span className="font-medium text-gray-900 text-sm sm:text-base">
                             {booking.experienceDetails.selectedDates?.to ? formatDate(booking.experienceDetails.selectedDates.to) : 'Not specified'}
                           </span>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

                         {booking.bookingType === 'wellness_class' && booking.classDetails && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                 <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                   <h3 className="text-lg font-semibold text-gray-900">Class Details</h3>
                 </div>
                 <div className="p-4 sm:p-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                         <div>
                       <h4 className="font-medium text-gray-900 mb-3">Class Information</h4>
                       <div className="space-y-3">
                         <div className="flex flex-col sm:flex-row sm:justify-between">
                           <span className="text-gray-600 text-sm sm:text-base">Attendee Count:</span>
                           <span className="font-medium text-gray-900 text-sm sm:text-base">{booking.classDetails.attendeeCount}</span>
                         </div>
                         <div className="flex flex-col sm:flex-row sm:justify-between">
                           <span className="text-gray-600 text-sm sm:text-base">Class Count:</span>
                           <span className="font-medium text-gray-900 text-sm sm:text-base">{booking.classDetails.classCount}</span>
                         </div>
                       </div>
                     </div>

                                         <div>
                       <h4 className="font-medium text-gray-900 mb-3">Selected Time Slots</h4>
                       <div className="space-y-2">
                         {booking.classDetails.selectedSlots?.map((slot, index) => (
                           <div key={index} className="flex flex-col sm:flex-row sm:justify-between text-sm">
                             <span className="text-gray-600 text-xs sm:text-sm">
                               {formatDate(slot.date)} at {formatTime(slot.startTime)}
                             </span>
                             <span className="font-medium text-gray-900 capitalize text-xs sm:text-sm">
                               {slot.mode}
                             </span>
                           </div>
                         ))}
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

                         {/* Customer Information */}
             {booking.customerInfo && (
               <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                 <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                   <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                 </div>
                 <div className="p-4 sm:p-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                         <div>
                       <h4 className="font-medium text-gray-900 mb-3">Contact Details</h4>
                       <div className="space-y-3">
                         <div className="flex items-center space-x-2">
                           <UserIcon className="w-4 h-4 text-gray-500" />
                           <span className="text-gray-900 text-sm sm:text-base">{booking.customerInfo.name}</span>
                         </div>
                         <div className="flex items-center space-x-2">
                           <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                           <span className="text-gray-900 text-sm sm:text-base break-all">{booking.customerInfo.email}</span>
                         </div>
                         {booking.customerInfo.phone && (
                           <div className="flex items-center space-x-2">
                             <PhoneIcon className="w-4 h-4 text-gray-500" />
                             <span className="text-gray-900 text-sm sm:text-base">{booking.customerInfo.phone}</span>
                           </div>
                         )}
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            )}
          </div>

                     {/* Sidebar */}
           <div className="space-y-4 sm:space-y-6">
             {/* Quick Actions */}
             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
               <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                 <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
               </div>
               <div className="p-4 sm:p-6">
                 <div className="space-y-3">
                  <button
                    onClick={() => navigate('/my-bookings')}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Back to My Bookings
                  </button>
                  
                  {booking.status === 'payment_pending' && (
                    <button
                      onClick={() => navigate(`/payment/status?bookingId=${booking.bookingId}`)}
                      className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    >
                      Complete Payment
                    </button>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => window.print()}
                      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Print Receipt
                    </button>
                  )}
                </div>
              </div>
            </div>

                         {/* Support */}
             <div className="bg-white rounded-lg shadow-sm border border-gray-200">
               <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                 <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
               </div>
               <div className="p-4 sm:p-6">
                 <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <ShieldCheckIcon className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">24/7 Support</h4>
                      <p className="text-sm text-gray-600">Get help anytime with our customer support team.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <DocumentTextIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Booking Policy</h4>
                      <p className="text-sm text-gray-600">View our cancellation and refund policies.</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/contact')}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage; 